import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KOC {
  id: string;
  full_name: string;
  channel_link: string;
  industries: string[];
  sales_method: string;
  follower_count: number;
  short_description: string;
  created_at: string;
}

const KOCList = () => {
  const [kocs, setKocs] = useState<KOC[]>([]);
  const [filteredKocs, setFilteredKocs] = useState<KOC[]>([]);
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
    fetchKocs();
  }, []);

  useEffect(() => {
    filterKocs();
  }, [kocs, searchTerm, selectedIndustry]);

  const fetchKocs = async () => {
    try {
      const { data, error } = await supabase
        .from('kocs')
        .select('id, full_name, channel_link, industries, sales_method, follower_count, short_description, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKocs(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách KOC",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterKocs = () => {
    let filtered = kocs;

    if (searchTerm) {
      filtered = filtered.filter(koc =>
        koc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        koc.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter(koc =>
        koc.industries.includes(selectedIndustry)
      );
    }

    setFilteredKocs(filtered);
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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
          <p className="text-muted-foreground">Đang tải danh sách KOC...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Danh sách KOC</h1>
          <p className="text-muted-foreground">
            Khám phá các Key Opinion Consumer tài năng để hợp tác
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
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
            Tìm thấy {filteredKocs.length} KOC
          </p>
        </div>

        {/* KOC Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKocs.map((koc) => (
            <Card key={koc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{koc.full_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4" />
                      {formatFollowerCount(koc.follower_count)} followers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Ngành hàng sở trường:</p>
                    <div className="flex flex-wrap gap-1">
                      {koc.industries.slice(0, 3).map((industry, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                      {koc.industries.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{koc.industries.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Hình thức bán hàng:</p>
                    <Badge variant="outline">{koc.sales_method}</Badge>
                  </div>

                  {koc.short_description && (
                    <div>
                      <p className="text-sm font-medium mb-1">Mô tả:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {koc.short_description}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(koc.channel_link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Xem kênh
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
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

        {filteredKocs.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy KOC</h3>
            <p className="text-muted-foreground">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc ngành hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KOCList;