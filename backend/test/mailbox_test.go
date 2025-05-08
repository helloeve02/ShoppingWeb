package test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestValidMailBoxInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid MailBox", func(t *testing.T) {
		mailbox := entity.MailBox{
			Date:     			time.Now(),
			AdminResponse:   	"ระบบอาจมีปัญหา ปิดหน้าต่างรอ 2-3 นาที แล้วกลับเข้าทำรายการใหม่",
			IsRead:				false,
			HelpCenterStatusID: 1,
			UserID: 			1,
			HelpCenterID:   	2,
		}

		ok, err := govalidator.ValidateStruct(mailbox)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
}
func TestInvalidMailBoxOtherFields(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Date", func(t *testing.T) {
		mailbox := entity.MailBox{
			Date:     			time.Time{},
			AdminResponse:   	"ไม่สามารถจ่ายเงินได้",
			IsRead:				false,
			HelpCenterStatusID: 1,
			UserID: 			1,
			HelpCenterID:   	2,
		}

		ok, err := govalidator.ValidateStruct(mailbox)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Date is required"))
	})

	t.Run("should pass validation for valid AdminResponse", func(t *testing.T) {
		mailbox := entity.MailBox{
			Date:     			time.Now(),
			AdminResponse:   	"",
			IsRead:				false,
			HelpCenterStatusID: 1,
			UserID: 			1,
			HelpCenterID:   	2,
		}

		ok, err := govalidator.ValidateStruct(mailbox)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("AdminResponse is required"))
	})

}

// ทดสอบ Foreign Key Fields
func TestInvalidMailBoxForeignKeys(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing HelpCenterStatusID", func(t *testing.T) {
		mailbox := entity.MailBox{
			Date:     			time.Now(),
			AdminResponse:   	"ไม่สามารถจ่ายเงินได้",
			IsRead:				false,
			HelpCenterStatusID: 0,
			UserID: 			1,
			HelpCenterID:   	2,
		}

		ok, err := govalidator.ValidateStruct(mailbox)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("HelpCenterStatusID is required"))
	})

	t.Run("should fail validation for missing UserID", func(t *testing.T) {
		mailbox := entity.MailBox{
			Date:     			time.Now(),
			AdminResponse:   	"ไม่สามารถจ่ายเงินได้",
			IsRead:				false,
			HelpCenterStatusID: 1,
			UserID: 			0,
			HelpCenterID:   	2,
		}

		ok, err := govalidator.ValidateStruct(mailbox)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run("should fail validation for missing HelpCenterID", func(t *testing.T) {
		mailbox := entity.MailBox{
			Date:     			time.Now(),
			AdminResponse:   	"ไม่สามารถจ่ายเงินได้",
			IsRead:				false,
			HelpCenterStatusID: 1,
			UserID: 			1,
			HelpCenterID:   	0,
		}

		ok, err := govalidator.ValidateStruct(mailbox)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("HelpCenterID is required"))
	})
}