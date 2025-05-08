package entity

import (
	"time"
	"gorm.io/gorm"
)

type Promotions struct {
	gorm.Model
	PromotionName   string        	`json:"promotion_name" valid:"required~Name is required"`
	Description 	string 			`json:"description" valid:"required~Description is required"`
	DiscountType 	bool          	`json:"discount_type" valid:"required~Discount type is required"`
	DiscountValue   int          	`json:"discount_value" valid:"required~Discount value is required"`
	UsageLimit   	int           	`json:"usage_limit" valid:"required~Usage limit is required"`
	StartDate    	time.Time     	`json:"start_date" valid:"required~Start date is required"`
	EndDate      	time.Time		`json:"end_date" valid:"required~End date is required"`

	PromotionStatusID  uint           `json:"promotion_status_id" valid:"required~Promotion status is required"`
	PromotionStatus    PromotionStatus `gorm:"foreignKey:PromotionStatusID" json:"promotion_status"`
	
	Products     	[]PromotionProducts  `gorm:"foreignKey:PromotionID" json:"products"`
	Users     	    []UserPromotions     `gorm:"foreignKey:PromotionID" json:"users"`
}