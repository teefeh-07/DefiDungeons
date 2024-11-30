;; Add to existing constants
(define-constant ERR-INVALID-DIFFICULTY (err u8))
(define-constant MIN_DIFFICULTY u1)
(define-constant MAX_DIFFICULTY u5)
(define-constant ERR-UNAUTHORIZED (err u9))
(define-constant ERR-TOKEN-TRANSFER (err u10))
(define-constant REWARD_AMOUNT u200)

;; New data var to track global difficulty settings
(define-data-var global-difficulty uint u1)

;; New map to store individual player difficulty preferences
(define-map player-difficulty-preferences 
    { player: principal }
    { preferred-difficulty: uint }
)
;; Updated player dungeon stats map with a structured record
(define-map player-dungeon-stats 
    { player: principal }
    {
        last-dungeon-block: uint,
        total-dungeons-completed: uint,
        total-rewards-earned: uint
    }
)

;; Mock token transfer function (replace with actual implementation)
(define-private (safe-transfer (token principal) (sender principal) (recipient principal) (amount uint))
    (begin
        ;; Placeholder for actual token transfer logic
        ;; In a real implementation, this would call the token contract's transfer method
        (if (> amount u0)
            (ok true)
            (err ERR-TOKEN-TRANSFER)
        )))
    