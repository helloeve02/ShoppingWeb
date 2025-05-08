package test

import (
	"github.com/sut67/team17/entity"
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestOrder(t *testing.T) {
	
	t.Run(`User ID is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		order := entity.Orders{
			TotalPrice: 1200,
			OrderDate:    time.Now(),
			OrderstatusID: 2,
			// UserID: 5,
			WalletsID: 3,
		}

		ok, err := govalidator.ValidateStruct(order)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(ContainSubstring("User is required"))
	})

	t.Run(`Total Price is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		order := entity.Orders{
			// TotalPrice: 1200,
			OrderDate:    time.Now(),
			OrderstatusID: 2,
			UserID: 5,
			WalletsID: 3,
		}


		ok, err := govalidator.ValidateStruct(order)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(ContainSubstring("TotalPrice is required"))
	})

	t.Run(`Orderstatus ID is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		order := entity.Orders{
			TotalPrice: 1200,
			OrderDate:    time.Now(),
			// OrderstatusID: 2,
			UserID: 5,
			WalletsID: 3,
		}

		ok, err := govalidator.ValidateStruct(order)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(ContainSubstring("OrderstatusID is required"))
	})
	
}



func TestOrderStatus(t *testing.T) {

	t.Run(`Status is required`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		order := entity.OrderStatus{
			// Status: "",
		}


		ok, err := govalidator.ValidateStruct(order)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Status is required"))
	})

	t.Run(`Status is valid`, func(t *testing.T) {
		g := NewGomegaWithT(t)

		order := entity.OrderStatus{
			Status: "waiting",
		}

		ok, err := govalidator.ValidateStruct(order)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
	
}