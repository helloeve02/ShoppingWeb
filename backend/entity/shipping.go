package entity

import (
	"time"

	"gorm.io/gorm"
)

// ตรวจสอบการเชื่อมต่อฐานข้อมูลและฟิลด์ Soft Delete
type Shipping struct {
    gorm.Model
    ShippingName             string
    Fee              int
    ShippingDate     time.Time
    // OrderID          uint
    ShippingStatusID uint // Foreign key that links to ShippingStatus
    ShippingStatus   ShippingStatus `gorm:"foreignKey:ShippingStatusID"`
	Orders []Orders `gorm:"foreignKey:ShippingID"`
}
