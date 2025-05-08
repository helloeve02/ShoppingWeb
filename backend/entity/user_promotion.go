package entity

import "gorm.io/gorm"

type UserPromotions struct {
    gorm.Model
    UserID      uint       `json:"user_id"`
    PromotionID uint       `json:"promotion_id"`
    UsageCount  int        `json:"usage_count"`
    User        Users      `gorm:"foreignKey:UserID"`
    Promotion   Promotions `gorm:"foreignKey:PromotionID"`
}
