package test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestValidArticleInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Articles", func(t *testing.T) {
		article := entity.Articles{
			Title:   		"ทำไมจ่ายด้วย QR Promptpay ไม่ได้?",
			Content:  		"*กรณีเลือกชำระเงินผ่านพร้อมเพย์ แต่ไม่มี QR โค้ดแสดง อาจเกิดจากระบบธนาคารขัดข้องหรือปิดปรับปรุง กรุณาเปลี่ยนช่องทางการชำระเงิน หรือลองกลับมาชำระใหม่ภายหลัง",
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(article)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
}
func TestInvalidArticleOtherFields(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing Title", func(t *testing.T) {
		article := entity.Articles{
			Title:   			"",
			Content:  		"*กรณีเลือกชำระเงินผ่านพร้อมเพย์ แต่ไม่มี QR โค้ดแสดง อาจเกิดจากระบบธนาคารขัดข้องหรือปิดปรับปรุง กรุณาเปลี่ยนช่องทางการชำระเงิน หรือลองกลับมาชำระใหม่ภายหลัง",
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(article)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Title is required"))
	})

	t.Run("should fail validation for missing Content", func(t *testing.T) {
		article := entity.Articles{
			Title:   			"ทำไมจ่ายด้วย QR Promptpay ไม่ได้?",
			Content:  		"",
			TopicID:   			2,
		}

		ok, err := govalidator.ValidateStruct(article)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Content is required"))
	})

}

// ทดสอบ Foreign Key Fields
func TestInvalidArticleForeignKeys(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing TopicID", func(t *testing.T) {
		article := entity.Articles{
			Title:   			"ทำไมจ่ายด้วย QR Promptpay ไม่ได้?",
			Content:  		"*กรณีเลือกชำระเงินผ่านพร้อมเพย์ แต่ไม่มี QR โค้ดแสดง อาจเกิดจากระบบธนาคารขัดข้องหรือปิดปรับปรุง กรุณาเปลี่ยนช่องทางการชำระเงิน หรือลองกลับมาชำระใหม่ภายหลัง",
			TopicID:   			0,
		}

		ok, err := govalidator.ValidateStruct(article)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("TopicID is required"))
	})

}