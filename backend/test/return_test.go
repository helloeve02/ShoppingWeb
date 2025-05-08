package test

import (
	"testing"
	. "github.com/onsi/gomega"
	"github.com/asaskevich/govalidator"
	"github.com/sut67/team17/entity"
)

func TestReturn(t *testing.T) {
	
	g := NewGomegaWithT(t)

	t.Run(`Return is valid`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description",
			ProvingImage: "Test.png",
			ReturnTypeID: 1,
			ReturnReasonID: 1,
			ReturnStatusID: 1,
			OrderID: 2,
			UserID: 1,
		}
	
		ok, err := govalidator.ValidateStruct(returns)
	
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	
	})

	t.Run(`Description is required`, func(t *testing.T) {
		returns := entity.Return{
			// Description: "", // Description ไม่มี
			ProvingImage: "Test.png",
			ReturnTypeID: 1,
			ReturnReasonID: 1,
			ReturnStatusID: 1,
			OrderID: 2,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run(`ProvingImage is required`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description", 
			ProvingImage: "", // ProvingImage ไม่มี
			ReturnTypeID: 1,
			ReturnReasonID: 1,
			ReturnStatusID: 1,
			OrderID: 2,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ProvingImage is required"))
	})

	t.Run(`ReturnType is required`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description", 
			ProvingImage: "Test.png", 
			// ReturnType ไม่มี
			ReturnReasonID: 1,
			ReturnStatusID: 1,
			OrderID: 2,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ReturnType is required"))
	})

	t.Run(`ReturnReason is required`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description", 
			ProvingImage: "Test.png", 
			ReturnTypeID: 1,
			// ReturnReason ไม่มี
			ReturnStatusID: 1,
			OrderID: 2,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ReturnReason is required"))
	})

	t.Run(`ReturnStatus is required`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description", 
			ProvingImage: "Test.png", 
			ReturnTypeID: 1,
			ReturnReasonID: 1,
			// ReturnStatus ไม่มี
			OrderID: 2,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ReturnStatus is required"))
	})

	t.Run(`OrderItems is required`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description", 
			ProvingImage: "Test.png", 
			ReturnTypeID: 1,
			ReturnReasonID: 1,
			ReturnStatusID: 2,
			// Order ไม่มี
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Order is required"))
	})

	t.Run(`User is required`, func(t *testing.T) {
		returns := entity.Return{
			Description: "This is description",
			ProvingImage: "Test.png",
			ReturnTypeID: 1,
			ReturnReasonID: 1,
			ReturnStatusID: 1,
			OrderID: 2,
			// User ไม่มี
		}

		ok, err := govalidator.ValidateStruct(returns)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("User is required"))
	})

}