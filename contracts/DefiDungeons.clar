;; Add to existing constants
(define-constant ERR-INVALID-DIFFICULTY (err u8))
(define-constant MIN_DIFFICULTY u1)
(define-constant MAX_DIFFICULTY u5)
(define-constant ERR-UNAUTHORIZED u9)

;; New data var to track global difficulty settings
(define-data-var global-difficulty uint u1)

;; New map to store individual player difficulty preferences
(define-map player-difficulty-preferences 
    { player: principal }
    { preferred-difficulty: uint }
)
(define-map player-dungeon-stats principal uint)

;; Enhanced enter dungeon function with difficulty mechanics
(define-public (enter-dungeon 
    (token principal) 
    (player principal) 
    (selected-difficulty uint)
)
    (let 
        (
            (player-balance u0)
            (current-block u8000)
            (global-diff (var-get global-difficulty))
        )
        ;; Check authorization
        (asserts! (is-eq tx-sender player) ERR-UNAUTHORIZED)

        ;; Store player's difficulty preference
        (map-set player-difficulty-preferences 
            { player: player }
            { preferred-difficulty: selected-difficulty }
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

;; Enhanced complete dungeon function with difficulty-based rewards
(define-public (complete-dungeon (token principal) (player principal))
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
            (player-difficulty (default-to u1 
                (get preferred-difficulty 
                    (map-get? player-difficulty-preferences { player: player })
                )
            ))
            (difficulty-multiplier (/ player-difficulty u1))
            (adjusted-reward (* REWARD_AMOUNT difficulty-multiplier))
        )
        ;; Check authorization
        (asserts! (is-eq tx-sender player) ERR-UNAUTHORIZED)

        ;; Transfer reward
        (try! (as-contract 
            (contract-call? token transfer
                tx-sender
                player
                adjusted-reward)))

        ;; Update player dungeon stats
        (map-set player-dungeon-stats 
            { player: player }
            {
                last-dungeon-block: current-block,
                total-dungeons-completed: (+ (get total-dungeons-completed player-stats) u1),
                total-rewards-earned: (+ (get total-rewards-earned player-stats) adjusted-reward)
            }
        )

        (ok true)
    )
)

;; Administrative function to set global difficulty
(define-public (set-global-difficulty (new-difficulty uint))
    (begin
        (asserts! 
            (and 
                (>= new-difficulty MIN_DIFFICULTY)
                (<= new-difficulty MAX_DIFFICULTY)
            ) 
            ERR-INVALID-DIFFICULTY
        )
        (var-set global-difficulty new-difficulty)
        (ok true)
    )
)

;; Read-only function to get player's preferred difficulty
(define-read-only (get-player-difficulty (player principal))
    (ok (default-to u1 
        (get preferred-difficulty 
            (map-get? player-difficulty-preferences { player: player })
        )
    ))
)