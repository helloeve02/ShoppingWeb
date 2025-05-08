package entity 

import "gorm.io/gorm"

type PromotionProducts struct {
	gorm.Model
	DiscountValue int		`json:"discount_value"`

	ProductID     uint      `json:"product_id"`
	PromotionID   uint      `json:"promotion_id"`

	Product       Products     `gorm:"foreignKey:ProductID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"product"`
	Promotion     Promotions   `gorm:"foreignKey:PromotionID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"promotion"`
}