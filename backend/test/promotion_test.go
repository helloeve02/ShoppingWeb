package test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
)

func TestPromotion(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`All valid`, func(t *testing.T) {
		promotion := entity.Promotions {
			PromotionName: "free",
			Description: "discount every 10 baht",
			DiscountType: true,
			DiscountValue: 20,
			UsageLimit: 4,
			StartDate: time.Now(),
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)
		
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`promotoin_name is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName: "", //ผิดตรงนี้
			Description: "free only for me",
			DiscountType: true,
			DiscountValue: 100,
			UsageLimit: 2,
			StartDate: time.Now(),
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Name is required"))
	})

	t.Run(`description is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName: "free",
			Description: "",
			DiscountType: true,
			DiscountValue: 2,
			UsageLimit: 3,
			StartDate: time.Now(),
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run(`discount type is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName: "free",
			Description: "buy 2 get 1 free",
			DiscountValue: 11,
			UsageLimit: 3,
			StartDate: time.Now(),
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Discount type is required"))
	})

	t.Run(`discount_value is required`, func(t *testing.T) {
		promotion := entity.Promotions {
			PromotionName: "buy 1 free 3",
			Description: "limited promotion",
			DiscountType: true,
			DiscountValue: 0,
			UsageLimit: 12,
			StartDate: time.Now(),
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Discount value is required"))

	})

	t.Run(`usage_limit is required`, func(t *testing.T) {
		promotion := entity.Promotions {
			PromotionName: "summer",
			Description: "only when buy 100b up",
			DiscountType: true,
			DiscountValue: 100,
			UsageLimit: 0,
			StartDate: time.Now(),
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Usage limit is required"))
	})

	t.Run(`start_date is required`, func(t *testing.T) {
		promotion := entity.Promotions {
			PromotionName: "Free shipping",
			Description: "one time use",
			DiscountType: true,
			DiscountValue: 10,
			UsageLimit: 12,
			StartDate: time.Time{},
			EndDate: time.Now(),
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Start date is required"))
	})

	t.Run(`end_date is required`, func(t *testing.T) {
		promotion := entity.Promotions {
			PromotionName: "Free shipping",
			Description: "one time use",
			DiscountType: true,
			DiscountValue: 10,
			UsageLimit: 12,
			StartDate: time.Now(),
			EndDate: time.Time{},
			PromotionStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("End date is required"))
	})
}