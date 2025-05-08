package entity

import "gorm.io/gorm"

type Address struct {
	gorm.Model
	Name          string        `valid:"required~Name is required"`
	Address       string       `valid:"required~Address is required"`
	SubDistrict   string        `valid:"required~SubDistrict is required"`
	District      string       `valid:"required~District is required"`
	Province      string       `valid:"required~Province is required"`
	PostalCode    string        `valid:"required~PostalCode is required,matches(^[0-9]{5}$)~PostalCode must be 5 digits"`
	PhoneNumber   string       `valid:"required~PhoneNumber: non zero value required,matches(^[0-9]{10}$)~PhoneNumber must be 10 digits"`
	AddressTypeID uint           
    AddressType    *AddressType  `gorm:"foreignKey: AddressTypeID" valid:"-"`

	UserID        uint 	 
	User      Users    `gorm:"foreignKey:UserID" valid:"-"`
}
