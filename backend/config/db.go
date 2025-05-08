package config

import (
	"fmt"
	"time"
	"log"
	"github.com/sut67/team17/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// DB returns the database connection instance
func DB() *gorm.DB {
	return db
}

// ConnectionDB initializes the database connection
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("shoppoo.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// SetupDatabase configures the database schema and seeds initial data
func SetupDatabase() {
	// Automigrate Tables
	err := db.AutoMigrate(
		&entity.Address{},
		&entity.CartItems{},
		&entity.Orders{},
		&entity.OrderItems{},
		&entity.OrderStatus{},
		&entity.Shipping{},
		&entity.ShippingStatus{},
		&entity.Users{},
		&entity.Payment{},
		&entity.Products{},
		&entity.ProductImages{},
		&entity.ProductStatus{},
		&entity.PromotionProducts{},
		&entity.Promotions{},
		&entity.PromotionStatus{},
		&entity.UserPromotions{},
		&entity.Brands{},
		&entity.Categories{},
		&entity.Genders{},
		&entity.HelpCenter{},
		&entity.InvoiceType{},
		&entity.Invoice{},
		&entity.Return{},
		&entity.ReturnType{},
		&entity.ReturnStatus{},
		&entity.ReturnReason{},
		&entity.HelpCenterStatus{},
		&entity.MailBox{},
		&entity.NotificationType{},
		&entity.Notifications{},
		&entity.PaymentStatus{},
		&entity.Transactions{},
		&entity.Wallets{},
		&entity.Topics{},
		&entity.Articles{},
		&entity.Reviews{},
		&entity.Favorites{},
	)
	if err != nil {
		panic("failed to migrate database: " + err.Error())
	}
	fmt.Println("Database tables migrated successfully")

	hashedPassword, _ := HashPassword("123456")
	users := []entity.Users{
		{FirstName: "Supaluck", LastName: "Tohthong", Email: "se@gmail.com", UserName: "Eveamare", Password: hashedPassword, Phone: "0987654321", Seller: true, Role: "User"},
		{FirstName: "Danuporn", LastName: "Seesin", Email: "aum@gmail.com", UserName: "aumaa", Password: hashedPassword, Phone: "0921345671", Seller: false, Role: "User"},
		{FirstName: "Admin", LastName: "Adminaa", Email: "admin@gmail.com", UserName: "adminjaa", Password: hashedPassword, Phone: "0999999999", Seller: false, Role: "Admin"},
	}
	
	for _, user := range users {
		db.FirstOrCreate(&user, entity.Users{FirstName: user.FirstName})
	}

	Products := []entity.Products{
		{ProductsName: "กระเป๋าสะพายหลัง Incase Facet 20L Backpack",
			Description:     "ฟังก์ชั่นที่แสดงออกถึงความคิดสร้างสรรค์ของวัยรุ่น Facet Backpack คือการเคลื่อนไหวด้วยการออกแบบที่แหวกแนวและสีที่ตัดกันสูง สร้างขึ้นสำหรับการเดินทาง วิทยาเขต และการใช้ชีวิตที่ต้องเดินทาง ภายนอกที่ทนทานสามารถทนต่อการใช้งานประจำวันในขณะที่จุได้มาก และช่วยให้เข้าถึงการจัดการได้ง่าย เก็บข้อมูลแบบแยกส่วน",
			Price:           3100,
			Stock:           20,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //1 กระเป๋า
		{ProductsName: "กระเป๋าสะพายหลัง Phase No. 2",
			Description:     "เลือกกระเป๋าเป้ใบนี้ ไม่มีคำว่าพลาด ไม่ว่าคุณจะอยู่ในช่วงไหนของชีวิต ด้วยพื้นที่กว้างขวางสำหรับใส่แล็ปท็อป อุปกรณ์ออกกำลังกาย และสิ่งอื่นๆ กระเป๋าใบนี้มีแผงบุด้านหลัง ดังนั้นไม่ว่าคุณจะใส่อะไร ก็สะพายได้อย่างสบายตัวเสมอ",
			Price:           890,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //2 กระเป๋า
		{ProductsName: "กระเป๋าคอมพิวเตอร์ Compact Sleeve in Flight Nylon สำหรับ MacBook Pro 14 นิ้ว [2021]",
			Description:     "กระเป๋าคอมพิวเตอร์ ดีไซน์ระดับพรีเมี่ยม วัสดุทำจาก Flight Nylon มีนํ้าหนักเบา เพิ่มความทนทาน และ มีประสิทธิภาพ ช่วยป้องกันรอยขีดข่วน และ ป้องกันกระแทก มีซิปดึงแบบกำหนดเอง และ ซิปช่องกระเป๋าอุปกรณ์เสริมด้านหน้าสำหรับใส่สายชาร์จ, หัวชาร์จ, เมาส์, สมุดโน้ต, แฟลชไดร์ฟ, และ อื่นๆ",
			Price:           2390,
			Stock:           1,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //3 กระเป๋า
		{ProductsName: "กระเป๋าเป้สะพายหลัง Pixoo Backpack - M",
			Description:     "กระเป๋าเป้สะพายหลัง รุ่น Pixoo Backpack M จากแบรนด์ DIVOOM Pixoo Backpack M เป็นกระเป๋าเป้สะพายหลัง ดีไซน์แบบแฟชั่นไอคอน ทันสมัยมาดึงดูดความสนใจของทุกคน กระเป๋าเป้สะพายหลังที่สามารถใช้ได้ในทุกสถานการณ์ ไม่ว่าจะเป็นวันสบายๆ หรือวันที่จะต้องทำงานกระเป๋าเป้สะพายหลัง สามารถใส่ของได้หลายช่อง",
			Price:           3790,
			Stock:           11,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //4 กระเป๋า
		{ProductsName: "กระเป๋า Pixoo Sling Bag",
			Description:     "ติดตั้งได้ง่ายๆ : เปิดใช้งานด้วยพาวเวอร์แบงค์ และ ใช้งานได้ดี คลาสสิคเกม : คุณสามารถเล่นมินิเกมศิลปะพิกเซลเพื่อฆ่าเวลาได้ ปลอดภัยมากขึ้นด้วยการควบคุมด้วยรีโมท : ใช้รีโมทคอนโทรลขณะขับขี่จักรยานได้",
			Price:           2690,
			Stock:           45,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //5 กระเป๋า
		{ProductsName: "กระเป๋า WFA Tote Bag Pro",
			Description:     "ดีไซน์ทันสมัย มินิมอล เรียบง่าย เข้าได้กับทุกสไตล์การแต่งกายใส่ใจสิ่งแวดล้อมด้วยวัสดุ (rPET) รีไซเคิล 100% จากขวดพลาสติก และใช้ตกแต่งด้วยวัสดุจากพืชน้ำหนักเบา จุของได้เยอะ ความจุ 16 ลิตร มีช่องกระเป๋าภายใน สายคล้องกุญแจ ช่องใส่ขวดน้ำ และ ช่องซ่อนสำหรับใส่ AirTag หรืออุปกรณ์ติดตาม",
			Price:           3290,
			Stock:           21,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //6 กระเป๋า
		{ProductsName: "กระเป๋าสะพายข้างใส่โทรศัพท์มือถือ 4G PU With Printed Stripes Wallet Phone Bag With Cord",
			Description:     "กระเป๋าสะพายข้างใส่โทรศัพท์มือถือ ออกแบบโดยแบรนด์ GUESS เป็นที่รู้จัก และ ยอมรับในด้านการออกแบบที่หรูหรา และ ไร้ที่ติ ปกป้องอุปกรณ์ของคุณอย่างมีสไตล์ มอบความสง่างาติดตัวคุณไปได้ทุกที นอกจากใส่โทรศัพท์มือถือแล้ว ยังสามารถใส่กระเป๋าสตางค์ เอกสาร กุญแจ และ ของใช้อื่นๆ",
			Price:           1490,
			Stock:           61,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //7 กระเป๋า
		{ProductsName: "กระเป๋าใส่บัตรพร้อมขาตั้ง Smart Fold MagFit Magnetic สี Black",
			Description:     "ล็อคการ์ดของคุณด้วย Smart Fold โฉมใหม่ ทันสมัยรอบด้าน และ พร้อมเสมอที่จะดีดกลับ และ ผ่อนคลาย ทำงานอย่างชาญฉลาดมากขึ้น ไม่ใช่หนักขึ้น",
			Price:           890,
			Stock:           32,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //8 กระเป๋า
		{ProductsName: "กระเป๋า 2-in-1 Tech Pouch",
			Description:     "เก็บสิ่งของทุกชิ้นให้เป็นระเบียบและหรือจะเก็บรวมกันก็ยิ่งจุของได้เยอะหรือแยกกระเป๋า Desk Pouch สำหรับสิ่งของที่ใช้บ่อยหยิบง่าย สะดวก และเก็บสิ่งของที่ใช้ไม่บ่อยไว้กระเป๋าใหญ่",
			Price:           2290,
			Stock:           12,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //9 กระเป๋า
		{ProductsName: "กระเป๋า A.R.C. Accessory Organizer สี Black",
			Description:     "ล็อคการ์ดของคุณด้วย Smart Fold โฉมใหม่ ทันสมัยรอบด้าน และ พร้อมเสมอที่จะดีดกลับ และ ผ่อนคลาย ทำงานอย่างชาญฉลาดมากขึ้น ไม่ใช่หนักขึ้น",
			Price:           2690,
			Stock:           3,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}, //10 กระเป๋า
	}

	for _, pkg := range Products {
		db.FirstOrCreate(&pkg, entity.Products{ProductsName: pkg.ProductsName})
	}

	images := []entity.ProductImages{
		{ProductID: 1, Image: "https://mediam.dotlife.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/i/n/incase_facet_20l_backpack.001.jpeg"},
		{ProductID: 2, Image: "https://ones3.sgp1.digitaloceanspaces.com/seven/1707725596.MkJKULovf7u1msOBhEmYYx0r2g3cmGIq.jpeg"},
		{ProductID: 3, Image: "https://mediam.dotlife.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/n/a/native_union_stow_lite_sleeve_macbook_cpw_.002.jpeg"},
		{ProductID: 4, Image: "https://mediam.dotlife.store/media/catalog/product/p/i/pixoo_m-backpack_cpw_.001.jpeg"},
		{ProductID: 5, Image: "https://mediam.dotlife.store/media/catalog/product/p/i/pixoo-sling-bag-007.jpg"},
		{ProductID: 6, Image: "https://mediam.dotlife.store/media/catalog/product/t/o/tote_bag.004_1.jpeg"},
		{ProductID: 7, Image: "https://mediam.dotlife.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/g/u/guess_.001_1.jpeg"},
		{ProductID: 8, Image: "https://mediam.istudio.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/s/p/spigen_smart_fold_magfit_magnetic_wallet_card_holder_-_black.004.jpeg"},
		{ProductID: 9, Image: "https://mediam.dotlife.store/media/catalog/product/o/r/orbitkey_2-in-1_tech_pouch.001_1.jpeg"},
		{ProductID: 10, Image: "https://mediam.dotlife.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/i/n/incase_a.r.c._accessory_organizer_-_black.001.jpeg"},
	}

	for _, img := range images {
		db.FirstOrCreate(&img, entity.ProductImages{ProductID: img.ProductID})
	}

	brands := []entity.Brands{
		{BrandName: "Apple"},
		{BrandName: "Samsung"},
		{BrandName: "Sony"},
		{BrandName: "Nike"},
		{BrandName: "Adidas"},
		{BrandName: "Puma"},
		{BrandName: "Gucci"},
		{BrandName: "Louis Vuitton"},
		{BrandName: "Toyota"},
		{BrandName: "Honda"},
		{BrandName: "Coca-Cola"},
		{BrandName: "Pepsi"},
		{BrandName: "Microsoft"},
		{BrandName: "Google"},
		{BrandName: "Amazon"},
	}

	for _, brands := range brands {
		db.FirstOrCreate(&brands, &entity.Brands{BrandName: brands.BrandName})
	}

	statuses := []entity.PromotionStatus{
		{PromotionStatusName: "Active"},
		{PromotionStatusName: "Expired"},
		{PromotionStatusName: "Completed"},
	}

	for _, status := range statuses {
		db.FirstOrCreate(&status, entity.PromotionStatus{PromotionStatusName: status.PromotionStatusName})
	}

	categories := []entity.Categories{
		{CategoryName: "Beauty and Personal Care", CategoryPicture: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifbgK6y247WxiaB7oUCXlA07rC_G2ajsdwniSKofgIjhXaOIgHYn-2wbez37iEzKTYyVYSjkiQ_mBbqOIIWx717f25U-WE7pIVA4446reRhbL9vrlrpr-tmrf6nFzmzFxp52ePh4SCRMQD/s640/Best+of+skin+care+hair+and+body+care+products+2019+1.jpeg"},
		{CategoryName: "Men's Fashion", CategoryPicture: "https://plus.unsplash.com/premium_photo-1725075088969-73798c9b422c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVuJTIwc2hpcnR8ZW58MHx8MHx8fDA%3D"},
		{CategoryName: "Bags", CategoryPicture: "https://images.unsplash.com/photo-1702325107940-88f9cd4468c2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHB1cnNlfGVufDB8fDB8fHww"},
		{CategoryName: "Women's Shoes", CategoryPicture: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNob2VzfGVufDB8fDB8fHww"},
		{CategoryName: "Men's Shoes", CategoryPicture: "https://images.unsplash.com/photo-1668069226492-508742b03147?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwc2hvZXN8ZW58MHx8MHx8fDA%3D"},
		{CategoryName: "Health Products", CategoryPicture: "https://img.freepik.com/free-photo/medical-treatment_23-2148108928.jpg?t=st=1737747993~exp=1737751593~hmac=8044974d36e8ba7015270f8dfdfe8632b73b1dad26323816e5fb47d9df2706a9&w=826"},
		{CategoryName: "Women's Fashion", CategoryPicture: "https://i.pinimg.com/736x/61/28/9d/61289d3877032a5fa32dd787d561ec67.jpg"},
		{CategoryName: "Jewelry", CategoryPicture: "https://i.pinimg.com/736x/5d/37/ae/5d37ae7b736df1b8eaa40e215af9b25d.jpg"},
		{CategoryName: "Home Appliances", CategoryPicture: "https://i.pinimg.com/736x/bb/23/6e/bb236efcbd204474685883012fd44735.jpg"},
		{CategoryName: "Electronics", CategoryPicture: "https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg"},
		{CategoryName: "Mobile Phones and Tablets", CategoryPicture: "https://i.pinimg.com/736x/ca/61/cd/ca61cdfc3028abd21e8ba72f1b909c87.jpg"},
		{CategoryName: "Home Appliances", CategoryPicture: "https://i.pinimg.com/736x/cf/8e/d4/cf8ed4cd3154931b93935b60f625aa54.jpg"},
		{CategoryName: "Computers and Laptops", CategoryPicture: "https://i.pinimg.com/736x/e2/e4/0a/e2e40a00423e1418c793a3aae821854f.jpg"},
		{CategoryName: "Cameras and Photography Equipment", CategoryPicture: "https://i.pinimg.com/736x/60/01/98/60019890fd3f73e303cb850d1c367a72.jpg"},
		{CategoryName: "Food and Beverages", CategoryPicture: "https://i.pinimg.com/736x/1d/04/94/1d0494c80adda47d0ecf70b036c2eb72.jpg"},
		{CategoryName: "Toys", CategoryPicture: "https://i.pinimg.com/736x/71/b5/ea/71b5ead2725f03da013ce91fb5cada42.jpg"},
		{CategoryName: "Mother and Baby Products", CategoryPicture: "https://i.pinimg.com/736x/ec/da/71/ecda71a297de768db855f21e3980d7e2.jpg"},
		{CategoryName: "Sports and Outdoor Activities", CategoryPicture: "https://i.pinimg.com/736x/fe/c1/7f/fec17fa72bc517d723916f1994986146.jpg"},
		{CategoryName: "Pets", CategoryPicture: "https://i.pinimg.com/736x/02/97/08/029708f8c421d04c3ba271beb797ea74.jpg"},
		{CategoryName: "Games and Accessories", CategoryPicture: "https://i.pinimg.com/736x/f3/0f/48/f30f485e5a1074ca9bdb1461dcdbe8ce.jpg"},
	}

	for _, category := range categories {
		db.FirstOrCreate(&category, &entity.Categories{CategoryName: category.CategoryName})
		db.Model(&category).Update("CategoryPicture", category.CategoryPicture)
	}

	status := []entity.ProductStatus{
		{ProductStatusName: "In Stock"},
		{ProductStatusName: "Out of Stock"},
		{ProductStatusName: "Awaiting Restock"},
		{ProductStatusName: "Discontinued"},
	}

	for _, status := range status {
		db.FirstOrCreate(&status, &entity.ProductStatus{ProductStatusName: status.ProductStatusName})
	}

	payment := []entity.Payment{
		{
			Amount:          1500,
			UserID:          1,
			PayerName:       "smile thawanhathai",
			PaymentStatusID: 1,
			// TransactionsID:  2,
			PaymentImage: "https://www.pinterest.com/pin/742249582355954325",
			PaymentDate:  time.Now(),
		},
	}
	for _, PaymentLoop := range payment {
		// ใช้ UserID และ PackageID เป็นเงื่อนไขในการค้นหา
		db.FirstOrCreate(&PaymentLoop, entity.Payment{UserID: PaymentLoop.UserID})
	}
	paymentstatus := []entity.PaymentStatus{
		{Status: "Wait"},
		{Status: "Cancel"},
		{Status: "Verify"},
		{Status: "Refun"},
		{Status: "Pay Order"},
	}

	for _, status := range paymentstatus {
		// Use Status as the condition for checking or creating the record
		db.FirstOrCreate(&status, entity.PaymentStatus{Status: status.Status})
	}
	wallet := []entity.Wallets{
		{
			Balance: 0,
			UserID:  2,
		},
		{
			Balance: 0,
			UserID:  1,
		},
	}
	for _, WalletLoop := range wallet {
		// Use Status as the condition for checking or creating the record
		db.FirstOrCreate(&WalletLoop, entity.Wallets{UserID: WalletLoop.UserID})
	}

	order := []entity.Orders{
		{
			TotalPrice:    1200,
			OrderDate:     time.Now(),
			OrderstatusID: 2,
			UserID:        5,
			WalletsID:     3,
		},
		{
			TotalPrice:    4500,
			OrderDate:     time.Now(),
			OrderstatusID: 4,
			UserID:        1,
			WalletsID:     3,
		},
	}

	for _, o := range order {
		// Use FirstOrCreate to ensure the item is found or created
		db.FirstOrCreate(&o, entity.Orders{
			UserID: o.UserID, // Use UserID or other fields to define uniqueness
		})
	}

	helpstatuses := []entity.HelpCenterStatus{
		{Status: "In progress"},
		{Status: "Success"},
	}

	for _, status := range helpstatuses {
		db.FirstOrCreate(&entity.HelpCenterStatus{}, entity.HelpCenterStatus{Status: status.Status})
	}

	topics := []entity.Topics{
		{Topic: "My Account"},
		{Topic: "Payments"},
		{Topic: "Refunds"},
		{Topic: "Shipping"},
	}
	for _, t := range topics {
		db.FirstOrCreate(&t, entity.Topics{Topic: t.Topic})
	}

	articles := []entity.Articles{
		{
			Title:   "Why can't I pay with QR PromptPay?",
			Content: "If you choose to pay via PromptPay but the QR code does not display, it might be due to a banking system issue or maintenance. Please try another payment method or attempt the transaction later.",
			TopicID: 2,
		},
		{
			Title:   "Where is my product?​",
			Content: "After completing your order, you can check the estimated delivery date in the shipping section.",
			TopicID: 4,
		},
		{
			Title:   "How can I update my account information?",
			Content: "You can update your account information by following these steps:\n1) Log in to your account.\n2) Go to 'Account' and click on the gear icon at the top right corner.\n3) Select 'Account Information' to edit your details.\n4) Update your information and ensure accuracy before saving.",
			TopicID: 1,
		},
		{
			Title:   "How do I return a product?",
			Content: "Follow these steps to request a product return:\n1) Click on 'View All Order Details'.\n2) Select the completed order you wish to return.\n3) Click 'Return/Refund' and fill out the form.\n4) Provide the necessary details and click 'Confirm'.",
			TopicID: 3,
		},
	}
	for _, rrs := range articles {
		db.FirstOrCreate(&rrs, entity.Articles{Title: rrs.Title})
	}

	// Config Return
	returnTypes := []entity.ReturnType{
		{Name: "Return by yourself"},
		{Name: "Return by shipping"},
	}
	for _, rtt := range returnTypes {
		db.FirstOrCreate(&rtt, entity.ReturnType{Name: rtt.Name})
	}

	returnReasons := []entity.ReturnReason{
		{Name: "I have change my mind"},
		{Name: "Item damaged"},
		{Name: "Wrong item sent"},
		{Name: "Other"},
	}
	for _, rrs := range returnReasons {
		db.FirstOrCreate(&rrs, entity.ReturnReason{Name: rrs.Name})
	}

	returnStatus := []entity.ReturnStatus{
		{Name: "Requesting"},
		{Name: "Approved"},
		{Name: "Denied"},
		{Name: "Success"},
	}
	for _, rss := range returnStatus {
		db.FirstOrCreate(&rss, entity.ReturnStatus{Name: rss.Name})
	}

	// Config Invoice
	invoiceTypes := []entity.InvoiceType{
		{Name: "Personal"},
		{Name: "Company"},
	}
	for _, ivt := range invoiceTypes {
		db.FirstOrCreate(&ivt, entity.InvoiceType{Name: ivt.Name})
	}

	address := []entity.Address{
		{
			Name:          "John Doe's Home",
			Address:       "1234 Elm Street",
			SubDistrict:   "Siam",
			District:      "Bangkok",
			Province:      "Bangkok",
			PostalCode:    "10100",
			PhoneNumber:   "0987654321",
			AddressTypeID: 1,
			UserID:        2,
		},
	}
	// Create Address record in the database
	if err := db.Create(&address).Error; err != nil {
		log.Fatalf("Failed to create address: %v", err)
	}

	fmt.Println("Address created successfully.")

	shippings := []entity.Shipping{
		{
			ShippingName: "Standard Delivery - ส่งธรรมดาในประเทศ",
			Fee:          50,
			ShippingDate: time.Now().AddDate(0, 0, 3), // Shipping in 3 days
			// OrderID:          1,
			// ShippingstatusID: 1,
		},
		{
			ShippingName: "Premium Delivery - ส่งพิเศษในประเทศ",
			Fee:          100,
			ShippingDate: time.Now().AddDate(0, 0, 7), // Shipping in 7 days
			// OrderID:          3,
			// ShippingstatusID: 3,
		},
	}

	for _, shipping := range shippings {
		db.FirstOrCreate(&shipping, entity.Shipping{ShippingName: shipping.ShippingName})
	}

	orderItems := []entity.OrderItems{
		{Quantity: 2, Price: 100, TotalPrice: 200.00, OrderID: 2, ProductID: 1, UserID: 1},
		{Quantity: 1, Price: 150, TotalPrice: 150.00, OrderID: 2, ProductID: 2, UserID: 1},
	}

	for _, oi := range orderItems {
		db.FirstOrCreate(&oi, entity.OrderItems{OrderID: oi.OrderID, ProductID: oi.ProductID, UserID: oi.UserID})
	}

	OrderStatus := []entity.OrderStatus{
		{Status: "Pending"},
		{Status: "Processing"},
		{Status: "Shipped"},
		{Status: "Completed"},
		{Status: "Cancelled"},
		{Status: "Returned"},
	}

	for _, status := range OrderStatus {
		db.FirstOrCreate(&status, entity.OrderStatus{Status: status.Status})
	}

	fmt.Println("OrderStatus data created successfully!")

	productImages := []entity.ProductImages{
		{Image: "https://mediam.dotlife.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/i/n/incase_facet_20l_backpack.001.jpeg",
			ProductID: 1},
	}
	if err := db.Create(&productImages).Error; err != nil {
		log.Fatal("Failed to seed product images:", err)
	}

	log.Println("Product images seeded successfully!")

	review := []entity.Reviews{
		{
			Rating:         4,
			Content:        "Excellent product!",
			Image:          "https://mediam.dotlife.store/media/catalog/product/cache/3b7e899159f673788675d87d1d929a98/i/n/incase_facet_20l_backpack.001.jpeg",
			FavoritesCount: 0,
			ProductID:      1,
			UserID:         1,
			OrderItemsID:   1,
		},
	}
	for _, rrs := range review {
		db.FirstOrCreate(&rrs, entity.Reviews{Rating: rrs.Rating})
	}

	//Gender
	GenderMale := entity.Genders{Gender: "Male"}
	GenderFemale := entity.Genders{Gender: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	//Type
	Type1 := entity.AddressType{Type: "Home"}
	Type2 := entity.AddressType{Type: "Work"}
	db.FirstOrCreate(&Type1, &entity.AddressType{Type: "Home"})
	db.FirstOrCreate(&Type2, &entity.AddressType{Type: "Work"})

	help := []entity.HelpCenter{
		{
			Subject:        		"Unable to Complete Payment",
			Description:    		"I tried to make a payment using my credit card, but the transaction failed. The error message stated 'Transaction declined.' I need assistance to resolve this issue.",
			Image: 					"https://storage.googleapis.com/support-forums-api/attachment/thread-125498398-10742944668485134424.jpg",
			UserID:      			1,
			TopicID:         		2,
			HelpCenterStatusID:   	1,
		},
	}
	for _, rrs := range help {
		db.FirstOrCreate(&rrs, entity.HelpCenter{Subject: rrs.Subject})
	}

	mailbox := []entity.MailBox{
		{
			AdminResponse:        	"Thank you for reaching out. We are currently reviewing your issue and will provide an update shortly. If you have any additional details, please feel free to share them here.",
			IsRead:    				false,
			UserID: 				1,
			HelpCenterStatusID:     2,
			HelpCenterID:         	1,
		},
	}
	for _, rrs := range mailbox {
		db.FirstOrCreate(&rrs, entity.MailBox{AdminResponse: rrs.AdminResponse})
	}
	
}
