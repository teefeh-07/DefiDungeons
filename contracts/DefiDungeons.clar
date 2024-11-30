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
(define-constant ENTRY-COST u100)
(define-constant REWARD_AMOUNT u200)
(define-constant DUNGEON_COOLDOWN_BLOCKS u100)

;; Contract ownership management
(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)
(define-data-var allowed-token principal 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-token)
(define-data-var ENTRY_COST uint u0)


;; Player dungeon tracking
(define-map player-dungeon-stats 
    { player: principal }
    {
        last-dungeon-block: uint,
        total-dungeons-completed: uint,
        total-rewards-earned: uint
    }
)

;; Existing read-only functions remain the same...

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

;; Enhanced enter dungeon function with cooldown
(define-public (enter-dungeon (token <token-trait>) (player principal))
    (let 
        (
            (player-balance (unwrap! (contract-call? token get-balance player) ERR-INSUFFICIENT-BALANCE))
            (current-block u8000)
            (player-stats (default-to 
                {
                    last-dungeon-block: u0, 
                    total-dungeons-completed: u0, 
                    total-rewards-earned: u0
                } 
                (map-get? player-dungeon-stats { player: player })
            ))
        )
        ;; Check authorization
        (asserts! (is-eq tx-sender player) ERR-UNAUTHORIZED)

        ;; Verify token contract
        (asserts! (is-valid-token token) ERR-INVALID-TOKEN)

        ;; Check cooldown
        (asserts! 
            (>= current-block 
                (+ (get last-dungeon-block player-stats) DUNGEON_COOLDOWN_BLOCKS)
            ) 
            ERR-DUNGEON-COOLDOWN
        )

        ;; Update player dungeon stats
        (map-set player-dungeon-stats 
            { player: player }
            {
                last-dungeon-block: current-block,
                total-dungeons-completed: (get total-dungeons-completed player-stats),
                total-rewards-earned: (get total-rewards-earned player-stats)
            }
        )

        (ok true)
    )
)

;; Enhanced complete dungeon function with stats tracking
(define-public (complete-dungeon (token <token-trait>) (player principal))
    (let
        (
            (current-block u8000)
            (player-stats (default-to 
                {
                    last-dungeon-block: u0, 
                    total-dungeons-completed: u0, 
                    total-rewards-earned: u0
                } 
                (map-get? player-dungeon-stats { player: player })
            ))
        )
        ;; Check authorization
        (asserts! (is-eq tx-sender player) ERR-UNAUTHORIZED)

        ;; Verify token contract
        (asserts! (is-valid-token token) ERR-INVALID-TOKEN)

        ;; Transfer reward
        (try! (as-contract 
            (contract-call? token transfer
                tx-sender
                player
                REWARD_AMOUNT)))

        ;; Update player dungeon stats
        (map-set player-dungeon-stats 
            { player: player }
            {
                last-dungeon-block: current-block,
                total-dungeons-completed: (+ (get total-dungeons-completed player-stats) u1),
                total-rewards-earned: (+ (get total-rewards-earned player-stats) REWARD_AMOUNT)
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
            total-rewards-earned: u0
        }
        (map-get? player-dungeon-stats { player: player })
    ))
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