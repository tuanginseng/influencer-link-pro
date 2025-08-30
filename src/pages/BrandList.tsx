import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: string;
  brand_name: string;
  contact_person: string;
  industry: string;
  expected_budget: number;
  short_description: string;
  created_at: string;
}

const BrandList = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const { toast } = useToast();

  const industries = [
    'Thời trang', 'Làm đẹp', 'Điện tử', 'Gia dụng', 'Thực phẩm',
    'Du lịch', 'Giáo dục', 'Sức khỏe', 'Thể thao', 'Mẹ và bé',
    'Nội thất', 'Phụ kiện', 'Giải trí', 'Khác'
  ];

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [brands, searchTerm, selectedIndustry]);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, brand_name, contact_person, industry, expected_budget, short_description, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách Brand",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBrands = () => {
    let filtered = brands;

    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter(brand =>
        brand.industry === selectedIndustry
      );
    }

    setFilteredBrands(filtered);
  };

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `${(budget / 1000000).toFixed(1)}M VNĐ`;
    } else if (budget >= 1000) {
      return `${(budget / 1000).toFixed(0)}K VNĐ`;
    }
    return `${budget} VNĐ`;
  };

  const handleContactAdmin = () => {
    toast({
      title: "Liên hệ Admin",
      description: "Chức năng liên hệ qua Admin đang được phát triển",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải danh sách Brand...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Danh sách Brand</h1>
          <p className="text-muted-foreground">
            Khám phá các thương hiệu đang tìm kiếm cơ hội hợp tác
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên thương hiệu hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Chọn ngành hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngành hàng</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Tìm thấy {filteredBrands.length} Brand
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{brand.brand_name}</CardTitle>
                    <CardDescription className="mt-1">
                      Người liên hệ: {brand.contact_person}
                    </CardDescription>
                  </div>
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Ngành hàng:</p>
                    <Badge variant="secondary">{brand.industry}</Badge>
                  </div>

                  {brand.expected_budget && (
                    <div>
                      <p className="text-sm font-medium mb-1">Ngân sách dự kiến:</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-primary">
                          {formatBudget(brand.expected_budget)}
                        </span>
                      </div>
                    </div>
                  )}

                  {brand.short_description && (
                    <div>
                      <p className="text-sm font-medium mb-1">Mô tả:</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {brand.short_description}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleContactAdmin}
                    >
                      Liên hệ qua Admin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy Brand</h3>
            <p className="text-muted-foreground">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc ngành hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandList;