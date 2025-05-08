package entity

import (
	"time"

	"gorm.io/gorm"
)

type Reviews struct {
	gorm.Model
	CreateDate 		time.Time	`json:"createdate" valid:"required~CreateDate is required"`
	Rating			uint	`json:"rating" valid:"required~Rating is required"`
	Content			string	`json:"content" valid:"required~Content is required"`
	Image			string	`json:"image" valid:"required~Image is required"`
	FavoritesCount  uint	`json:"favorites_count"`

	ProductID uint `json:"product_id" valid:"required~ProductID is required"`
	Product   Products `gorm:"foreignKey:ProductID" valid:"-"`

	UserID uint `json:"user_id" valid:"required~UserID is required"`
	User   Users `gorm:"foreignKey:UserID" valid:"-"`

	OrderItemsID uint `json:"orderitems_id" valid:"required~OrderItemsID is required"`	
	OrderItems	OrderItems `gorm:"foreignKey:OrderItemsID" valid:"-"`

	Favorites []Favorites `gorm:"foreignKey:ReviewID"`
}
