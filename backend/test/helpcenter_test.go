package test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestValidHelpInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid HelpCenter", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"ไม่สามารถจ่ายเงินได้",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้",
			Image:      		"help.png",
			HelpCenterStatusID: 1,
			UserID: 			1,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
}
func TestInvalidHelpOtherFields(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing Subject", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้.",
			Image:      		"help.png",
			HelpCenterStatusID: 1,
			UserID: 			1,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Subject is required"))
	})

	t.Run("should fail validation for missing Description", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"ไม่สามารถจ่ายเงินได้.",
			Description:  		"",
			Image:      		"help.png",
			HelpCenterStatusID: 1,
			UserID: 			1,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run("should fail validation for missing Date", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Time{},
			Subject:   			"ไม่สามารถจ่ายเงินได้",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้.",
			Image:      		"help.png",
			HelpCenterStatusID: 1,
			UserID: 			1,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Date is required"))
	})

	t.Run("should fail validation for missing Image", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"ไม่สามารถจ่ายเงินได้",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้",
			Image:      		"",
			HelpCenterStatusID: 1,
			UserID: 			1,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Image is required"))
	})
}

// ทดสอบ Foreign Key Fields
func TestInvalidHelpForeignKeys(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing HelpCenterStatusID", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"ไม่สามารถจ่ายเงินได้",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้",
			Image:      		"help.png",
			HelpCenterStatusID: 0,
			UserID: 			1,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("HelpCenterStatusID is required"))
	})

	t.Run("should fail validation for missing UserID", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"ไม่สามารถจ่ายเงินได้",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้",
			Image:      		"help.png",
			HelpCenterStatusID: 1,
			UserID: 			0,
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run("should fail validation for missing TopicID", func(t *testing.T) {
		helpcenter := entity.HelpCenter{
			Date:     			time.Now(),
			Subject:   			"ไม่สามารถจ่ายเงินได้",
			Description:  		"กดสั่งซื้อสินค้าแล้วแต่ไม่สามารถสแกนจ่ายเงินได้",
			Image:      		"help.png",
			HelpCenterStatusID: 1,
			UserID: 			1,
			TopicID:   			0,
		}

		ok, err := govalidator.ValidateStruct(helpcenter)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("TopicID is required"))
	})
}