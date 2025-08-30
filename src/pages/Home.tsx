import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Kết nối KOC và Brand
            <span className="block text-primary">Dễ dàng & Hiệu quả</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nền tảng kết nối chuyên nghiệp giữa Key Opinion Consumer (KOC) và các thương hiệu, 
            tạo cơ hội hợp tác kinh doanh bền vững.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/register?type=koc">Đăng ký làm KOC</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/register?type=brand">Đăng ký làm Brand</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Tại sao chọn KOC Connect?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Kết nối chuyên nghiệp</CardTitle>
                <CardDescription>
                  Tìm kiếm và kết nối với KOC/Brand phù hợp theo ngành hàng và yêu cầu cụ thể
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Quản lý tập trung</CardTitle>
                <CardDescription>
                  Admin hỗ trợ trung gian, đảm bảo quy trình hợp tác minh bạch và hiệu quả
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Tăng trưởng bền vững</CardTitle>
                <CardDescription>
                  Xây dựng mối quan hệ hợp tác lâu dài, tăng doanh thu cho cả KOC và Brand
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Bắt đầu hành trình của bạn ngay hôm nay
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Tham gia cộng đồng KOC Connect để khám phá những cơ hội hợp tác tuyệt vời
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/kocs">Xem danh sách KOC</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/brands">Xem danh sách Brand</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;