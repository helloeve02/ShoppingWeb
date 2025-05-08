package entity

import (
	"gorm.io/gorm"
)

type Return struct {
	gorm.Model
	Description  string `valid:"required~Description is required, stringlength(1|1000)"`
	ProvingImage string `valid:"required~ProvingImage is required" gorm:"type:longtext"`

	ReturnTypeID uint       `valid:"required~ReturnType is required"`
	ReturnType   ReturnType `gorm:"foreignKey:ReturnTypeID"  valid:"-"`

	ReturnReasonID uint         `valid:"required~ReturnReason is required"`
	ReturnReason   ReturnReason `gorm:"foreignKey:ReturnReasonID"  valid:"-"`

	ReturnStatusID uint         `valid:"required~ReturnStatus is required"`
	ReturnStatus   ReturnStatus `gorm:"foreignKey:ReturnStatusID"  valid:"-"`

	OrderID uint       `valid:"required~Order is required"`
	Order   Orders `gorm:"foreignKey:OrderID"  valid:"-"`

	UserID uint  `valid:"required~User is required"`
	User   Users `gorm:"foreignKey:UserID" valid:"-"`
}
