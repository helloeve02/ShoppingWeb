package entity


import (

   "time"

   "gorm.io/gorm"

)
//entity user
type Users struct {
   gorm.Model

   FirstName string     `valid:"required~FirstName is required"`
   LastName  string     `valid:"required~LastName is required"`
   UserName  string    `valid:"required~UserName is required"`
   Phone     string     `valid:"required~PhoneNumber: non zero value required"`
   Email     string    `valid:"required~Email: non zero value required, email~Email is invalid"`
   Password  string    `valid:"required~Password is required"`
   Seller        bool       `json:"seller"`
   StoreName     string     `json:"store_name"`
   PickupAddress string     `json:"pickup_address"`
   Role          string     `json:"role"`
   BirthDay      time.Time  `json:"birthday"`
   GenderID      uint       `json:"gender_id"`
   Gender        *Genders   `gorm:"foreignKey:gender_id" json:"gender"`
   PaymentID     uint
   Wallets       []Wallets  `gorm:"foreignKey:UserID"`
   Order         []Orders   `gorm:"foreignKey:UserID"`
   Cartitem      []CartItems `gorm:"foreignKey:UserID"`
   Orderitem     []OrderItems `gorm:"foreignKey:UserID"`
   Product       []Products `gorm:"foreignKey:UserID"`
   HelpCenters   []HelpCenter `gorm:"foreignKey:UserID"`
   Favorites     []Favorites `gorm:"foreignKey:UserID"`
   Reviews       []Reviews   `gorm:"foreignKey:UserID"`
   Return        []Return    `gorm:"foreignKey:UserID"`
   Invoice       []Invoice   `gorm:"foreignKey:UserID"`
   No            []Invoice   `gorm:"foreignKey:UserID"`
   Transactions  []Transactions `gorm:"foreignKey:UserID"`
   Promotion     []UserPromotions    `gorm:"foreignKey:UserID" json:"promotions"`
   Notification  []Notifications   `gorm:"foreignKey:UserID"`
}
