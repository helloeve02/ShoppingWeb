package test

import (
	"testing"
	// "time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestWallet(t *testing.T) {

	
	t.Run(`User ID is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		wallet := entity.Wallets{
			// UserID: 1,
			Balance: 100,
		}


		ok, err := govalidator.ValidateStruct(wallet)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run(`Balance is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		wallet := entity.Wallets{
			// UserID: 1,
			Balance: 100,
		}


		ok, err := govalidator.ValidateStruct(wallet)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run(`Status is valid`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		wallet := entity.Wallets{
			UserID: 1,
			Balance: 100,
		}

		ok, err := govalidator.ValidateStruct(wallet)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`History is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		trans := entity.Transactions{
			UserID: 1,
			WalletsID: 1,
			PaymentID: 1,
			OrderID: 1,
			// History: ,
		}


		ok, err := govalidator.ValidateStruct(trans)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("History is required"))
	})

	
}