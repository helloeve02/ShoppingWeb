package test

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestFirstName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`FirstName is required`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "", // Invalid: FirstName is required
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FirstName is required"))
	})

	t.Run(`FirstName is valid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha", // Valid FirstName 
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestLastName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`LastName is required`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"", // Invalid: LastName is required
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("LastName is required"))
	})

	t.Run(`LastName is valid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin", // Valid LastName 
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestUserName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`UserName is required`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin", 
			UserName:	"", // Invalid: UserName is required
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserName is required"))
	})

	t.Run(`UserName is valid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin", 
			UserName:	"chaya", // Valid UserName 
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPassword(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Password is required`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin", 
			UserName:	"Chaya", 
			Password:   "", // Invalid: Password is required
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Password is required"))
	})

	t.Run(`Password is valid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin", 
			UserName:	"chaya", 
			Password:   "123456", // Valid Password 
			Phone:	"0123456789",
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}


func TestPhone(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PhoneNumber is required`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "cha",
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"",// Invalid: Phone number is required
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
	
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PhoneNumber: non zero value required"))
	})

	t.Run(`PhoneNumber is valid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789", // Valid phone number
			Email:	"cha@gmail.com",
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}


func TestEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Email is required`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789", 
			Email:	"", // Invalid: Email is required
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email: non zero value required"))
	})

	t.Run(`Email is invalid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha_gmail", // Invalid Email format
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email is invalid"))
	})

	t.Run(`Email is valid`, func(t *testing.T) {
		user := entity.Users{
			FirstName: "Cha",
			LastName:	"Hin",
			UserName:	"chaya",
			Password:   "123456",
			Phone:	"0123456789",
			Email:	"cha@gmail.com", // Valid Email ลืมปิด
			Seller: true,
			Role:	"user" ,
			BirthDay:  time.Date(2001, 2, 12, 0, 0, 0, 0, time.UTC),
			GenderID: 2,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}