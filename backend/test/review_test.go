package test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestValidReviewInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Reviews", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			4,
			Content:		"ดีมาก ๆ ",
			Image:			"review.png",
			ProductID:		1,
			UserID:			1,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
}
func TestInvalidReviewOtherFields(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing CreateDate", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Time{},
			Rating:			4,
			Content:		"ดีมากกก",
			Image:			"review.png",
			ProductID:		1,
			UserID:			1,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("CreateDate is required"))
	})

	t.Run("should fail validation for missing Rating", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			0,
			Content:		"ดีมาก",
			Image:			"review.png",
			ProductID:		1,
			UserID:			1,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Rating is required"))
	})

	t.Run("should fail validation for missing Content", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			4,
			Content:		"",
			Image:			"review.png",
			ProductID:		1,
			UserID:			1,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Content is required"))
	})

	t.Run("should fail validation for missing Image", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			4,
			Content:		"ดี",
			Image:			"",
			ProductID:		1,
			UserID:			1,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Image is required"))
	})
}

// ทดสอบ Foreign Key Fields
func TestInvalidReviewForeignKeys(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing ProductID", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			4,
			Content:		"ดีมาก",
			Image:			"review.png",
			ProductID:		0,
			UserID:			1,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("ProductID is required"))
	})

	t.Run("should fail validation for missing UserID", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			4,
			Content:		"ดีมาก",
			Image:			"review.png",
			ProductID:		1,
			UserID:			0,
			OrderItemsID:	1,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run("should fail validation for missing OrderItemsID", func(t *testing.T) {
		review := entity.Reviews{
			CreateDate: 	time.Now(),
			Rating:			4,
			Content:		"ดีมาก",
			Image:			"review.png",
			ProductID:		1,
			UserID:			1,
			OrderItemsID:	0,
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("OrderItemsID is required"))
	})
}