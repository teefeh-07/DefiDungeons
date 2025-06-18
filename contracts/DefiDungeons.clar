;; DeFi Dungeons Smart Contract
;; Define token trait with proper syntax
(define-trait token-trait
    (
        (get-balance (principal) (response uint uint))
        (transfer (principal principal uint) (response bool uint))
    )
)

;; Constants for better maintenance
(define-constant ERR-INSUFFICIENT-BALANCE (err u1))
(define-constant ERR-UNAUTHORIZED (err u2))
(define-constant ERR-INVALID-TOKEN (err u3))
(define-constant ERR-NOT-CONTRACT-OWNER (err u4))
(define-constant ERR-INVALID-PRINCIPAL (err u5))
(define-constant ERR-PENDING-OWNER-ONLY (err u6))
(define-constant ERR-DUNGEON-COOLDOWN (err u7))
(define-constant ERR-INVALID-DIFFICULTY (err u8))
(define-constant ENTRY-COST u100)
(define-constant BASE-REWARD-AMOUNT u200)
(define-constant DUNGEON_COOLDOWN_BLOCKS u100)
(define-constant MIN-DIFFICULTY u1)
(define-constant MAX-DIFFICULTY u5)

;; Contract ownership management
(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)
(define-data-var allowed-token principal 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-token)
(define-data-var global-difficulty uint u1)


;; Player dungeon tracking
(define-map player-dungeon-stats
    { player: principal }
    {
        last-dungeon-block: uint,
        total-dungeons-completed: uint,
        total-rewards-earned: uint,
        player-difficulty: uint
    }
)

;; Enhanced private helper functions
(define-private (is-contract-owner)
    (is-eq tx-sender (var-get contract-owner))
)

(define-private (is-valid-token (token <token-trait>))
    (is-eq (contract-of token) (var-get allowed-token))
)

(define-private (is-valid-principal (address principal))
    (and
        (not (is-eq address (var-get contract-owner)))
        (not (is-eq address tx-sender))
        (not (is-eq address (as-contract tx-sender)))
    )
)

(define-private (is-valid-difficulty (difficulty uint))
    (and
        (>= difficulty MIN-DIFFICULTY)
        (<= difficulty MAX-DIFFICULTY)
    )
)

(define-private (calculate-reward (difficulty uint))
    (* BASE-REWARD-AMOUNT difficulty)
)

;; Enhanced enter dungeon function with cooldown and difficulty
(define-public (enter-dungeon (token <token-trait>) (player principal) (difficulty uint))
    (let
        (
            (player-balance (unwrap! (contract-call? token get-balance player) ERR-INSUFFICIENT-BALANCE))
            (current-block stacks-block-height)
            (player-stats (default-to
                {
                    last-dungeon-block: u0,
                    total-dungeons-completed: u0,
                    total-rewards-earned: u0,
                    player-difficulty: u1
                }
                (map-get? player-dungeon-stats { player: player })
            ))
        )
        ;; Check authorization
        (asserts! (is-eq tx-sender player) ERR-UNAUTHORIZED)

        ;; Verify token contract
        (asserts! (is-valid-token token) ERR-INVALID-TOKEN)

        ;; Validate difficulty
        (asserts! (is-valid-difficulty difficulty) ERR-INVALID-DIFFICULTY)

        ;; Check sufficient balance for entry cost
        (asserts! (>= player-balance ENTRY-COST) ERR-INSUFFICIENT-BALANCE)

        ;; Check cooldown
        (asserts!
            (>= current-block
                (+ (get last-dungeon-block player-stats) DUNGEON_COOLDOWN_BLOCKS)
            )
            ERR-DUNGEON-COOLDOWN
        )

        ;; Charge entry cost
        (try! (contract-call? token transfer player (as-contract tx-sender) ENTRY-COST))

        ;; Update player dungeon stats
        (map-set player-dungeon-stats
            { player: player }
            {
                last-dungeon-block: current-block,
                total-dungeons-completed: (get total-dungeons-completed player-stats),
                total-rewards-earned: (get total-rewards-earned player-stats),
                player-difficulty: difficulty
            }
        )

        (ok true)
    )
)

;; Enhanced complete dungeon function with difficulty-based rewards
(define-public (complete-dungeon (token <token-trait>) (player principal))
    (let
        (
            (current-block stacks-block-height)
            (player-stats (unwrap! (map-get? player-dungeon-stats { player: player }) ERR-UNAUTHORIZED))
            (difficulty (get player-difficulty player-stats))
            (reward-amount (calculate-reward difficulty))
        )
        ;; Check authorization
        (asserts! (is-eq tx-sender player) ERR-UNAUTHORIZED)

        ;; Verify token contract
        (asserts! (is-valid-token token) ERR-INVALID-TOKEN)

        ;; Ensure player has entered a dungeon (has stats)
        (asserts! (> (get last-dungeon-block player-stats) u0) ERR-UNAUTHORIZED)

        ;; Transfer difficulty-based reward
        (try! (as-contract
            (contract-call? token transfer
                tx-sender
                player
                reward-amount)))

        ;; Update player dungeon stats
        (map-set player-dungeon-stats
            { player: player }
            {
                last-dungeon-block: current-block,
                total-dungeons-completed: (+ (get total-dungeons-completed player-stats) u1),
                total-rewards-earned: (+ (get total-rewards-earned player-stats) reward-amount),
                player-difficulty: difficulty
            }
        )

        (ok true)
    )
)

;; Read-only function to get player dungeon stats
(define-read-only (get-player-dungeon-stats (player principal))
    (ok (default-to
        {
            last-dungeon-block: u0,
            total-dungeons-completed: u0,
            total-rewards-earned: u0,
            player-difficulty: u1
        }
        (map-get? player-dungeon-stats { player: player })
    ))
)

;; Read-only function to get global difficulty
(define-read-only (get-global-difficulty)
    (ok (var-get global-difficulty))
)

;; Read-only function to get contract owner
(define-read-only (get-contract-owner)
    (ok (var-get contract-owner))
)

;; Read-only function to get allowed token
(define-read-only (get-allowed-token)
    (ok (var-get allowed-token))
)

;; Protected administrative function to update allowed token
(define-public (set-allowed-token (new-token principal))
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (asserts! (not (is-eq new-token (var-get allowed-token))) ERR-INVALID-PRINCIPAL)
        (var-set allowed-token new-token)
        (ok true)
    )
)

;; Two-step ownership transfer functions
(define-public (initiate-contract-ownership-transfer (new-owner principal))
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (asserts! (is-valid-principal new-owner) ERR-INVALID-PRINCIPAL)
        (var-set pending-owner (some new-owner))
        (ok true)
    )
)

(define-public (accept-contract-ownership)
    (let 
        ((pending (unwrap! (var-get pending-owner) ERR-PENDING-OWNER-ONLY)))
        (asserts! (is-eq tx-sender pending) ERR-UNAUTHORIZED)
        (var-set contract-owner pending)
        (var-set pending-owner none)
        (ok true)
    )
)

;; Cancel pending ownership transfer
(define-public (cancel-contract-ownership-transfer)
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (var-set pending-owner none)
        (ok true)
    )
)

;; Set global difficulty level
(define-public (set-global-difficulty (new-difficulty uint))
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (asserts! (is-valid-difficulty new-difficulty) ERR-INVALID-DIFFICULTY)
        (var-set global-difficulty new-difficulty)
        (ok true)
    )
)