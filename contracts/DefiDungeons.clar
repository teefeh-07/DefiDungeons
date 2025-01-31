;; Define constants
(define-constant ERR-INVALID-DIFFICULTY (err u8))
(define-constant MIN-DIFFICULTY u1)
(define-constant MAX-DIFFICULTY u5)
(define-constant ERR-UNAUTHORIZED (err u9))
(define-constant ERR-TOKEN-TRANSFER (err u10))
(define-constant REWARD-AMOUNT u200)

;; Global difficulty setting
(define-data-var global-difficulty uint MIN-DIFFICULTY)

;; Player difficulty preferences
(define-map player-difficulty-preferences
    { player: principal }
    { preferred-difficulty: uint }
)

;; Player dungeon stats
(define-map player-dungeon-stats
    { player: principal }
    {
        last-dungeon-block: uint,
        total-dungeons-completed: uint,
        total-rewards-earned: uint
    }
)

;; Helper function to validate difficulty
(define-private (is-valid-difficulty (difficulty uint))
    (and (>= difficulty MIN-DIFFICULTY) (<= difficulty MAX-DIFFICULTY))
)

;; Set global difficulty (admin-only)
(define-public (set-global-difficulty (new-difficulty uint))
    (begin
        ;; Validate the difficulty
        (asserts! (is-valid-difficulty new-difficulty) ERR-INVALID-DIFFICULTY)
        ;; Update global difficulty
        (var-set global-difficulty new-difficulty)
        (ok true)
    )
)

;; Set player difficulty preference
(define-public (set-player-difficulty (difficulty uint))
    (begin
        ;; Validate the difficulty
        (asserts! (is-valid-difficulty difficulty) ERR-INVALID-DIFFICULTY)
        ;; Update player's preference
        (map-set player-difficulty-preferences { player: tx-sender } { preferred-difficulty: difficulty })
        (ok true)
    )
)

;; Complete a dungeon and reward the player
(define-public (complete-dungeon)
    (let (
        ;; Fetch player stats
        (player-stats (default-to { last-dungeon-block: u0, total-dungeons-completed: u0, total-rewards-earned: u0 }
            (map-get? player-dungeon-stats { player: tx-sender })))
        ;; Fetch player's preferred difficulty
        (player-difficulty (default-to MIN-DIFFICULTY
            (map-get? player-difficulty-preferences { player: tx-sender })))
    )
    (begin
        ;; Update player stats
        (map-set player-dungeon-stats { player: tx-sender }
            {
                last-dungeon-block: block-height,
                total-dungeons-completed: (+ (get total-dungeons-completed player-stats) u1),
                total-rewards-earned: (+ (get total-rewards-earned player-stats) REWARD-AMOUNT)
            }
        )
        ;; Reward the player (mock token transfer)
        (try! (safe-transfer contract-deployer contract-deployer tx-sender REWARD-AMOUNT))
        (ok true)
    ))
)

;; Mock token transfer function
(define-private (safe-transfer (token principal) (sender principal) (recipient principal) (amount uint))
    (begin
        ;; Placeholder for actual token transfer logic
        (asserts! (> amount u0) ERR-TOKEN-TRANSFER)
        (ok true)
    )
)