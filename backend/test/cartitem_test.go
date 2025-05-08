package test

import (
	"github.com/sut67/team17/entity"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestCartItem(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Quantity is required`, func(t *testing.T) {
		cartitem := entity.CartItems{
			// Missing Quantity
			// TotalPrice: 399.98,
			ProductID:  1,
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(cartitem)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Quantity is required"))
	})

	t.Run(`UserID is required`, func(t *testing.T) {
		cartitem := entity.CartItems{
			Quantity:   1,
			// TotalPrice: 399.98,
			ProductID:  1,
			// Missing UserID
		}

		ok, err := govalidator.ValidateStruct(cartitem)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("UserID is required"))
	})

	t.Run(`ProductID is required`, func(t *testing.T) {
		cartitem := entity.CartItems{
			Quantity:   1,
			// TotalPrice: 399.98,
			UserID:     1,
			// Missing ProductID
		}

		ok, err := govalidator.ValidateStruct(cartitem)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("ProductID is required"))
	})

	t.Run(`Quantity is valid`, func(t *testing.T) {
		cartitem := entity.CartItems{
			Quantity:   2,
			// TotalPrice: 399,
			ProductID:  1, // ใช้ ID จาก product ตัวอย่าง
			UserID:     1,    // ใช้ ID จาก user ตัวอย่าง
		}
	
		ok, err := govalidator.ValidateStruct(cartitem)
	
		g.Expect(ok).To(BeTrue(), "Validation should pass for valid Quantity")
		g.Expect(err).To(BeNil(), "Error should be nil for valid Quantity")
	})
	
	
	
}
