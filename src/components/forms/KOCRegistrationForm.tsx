import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const industries = [
  'Thời trang', 'Làm đẹp', 'Điện tử', 'Gia dụng', 'Thực phẩm',
  'Du lịch', 'Giáo dục', 'Sức khỏe', 'Thể thao', 'Mẹ và bé',
  'Nội thất', 'Phụ kiện', 'Giải trí', 'Khác'
];

const kocSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  channel_link: z.string().url("Link kênh không hợp lệ"),
  channel_id: z.string().min(1, "ID kênh không được để trống"),
  industries: z.array(z.string()).min(1, "Chọn ít nhất 1 ngành hàng").max(3, "Chọn tối đa 3 ngành hàng"),
  sales_method: z.string().min(1, "Vui lòng chọn hình thức bán hàng"),
  follower_count: z.number().min(0, "Số lượng follower phải >= 0"),
  expected_cast: z.number().optional(),
  shipping_address: z.string().min(10, "Địa chỉ nhận hàng phải chi tiết"),
  gmv_30_days: z.number().optional(),
  collaboration_description: z.string().optional(),
  job_completion_days: z.number().min(1, "Tốc độ trả job phải >= 1 ngày"),
  team_size: z.number().min(0, "Số lượng KOC có thể tập hợp phải >= 0"),
  short_description: z.string().optional(),
});

type KOCFormData = z.infer<typeof kocSchema>;

const KOCRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<KOCFormData>({
    resolver: zodResolver(kocSchema),
    defaultValues: {
      industries: [],
      sales_method: "Video",
      follower_count: 0,
      job_completion_days: 3,
      team_size: 0,
    },
  });

  const onSubmit = async (data: KOCFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('kocs')
        .insert([data as any]);

      if (error) throw error;

      toast({
        title: "Đăng ký thành công!",
        description: "Thông tin KOC của bạn đã được ghi nhận. Admin sẽ liên hệ sớm.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đăng ký KOC</CardTitle>
        <CardDescription>
          Vui lòng điền đầy đủ thông tin để chúng tôi có thể kết nối bạn với các Brand phù hợp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại *</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="channel_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link kênh *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="channel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID kênh *</FormLabel>
                    <FormControl>
                      <Input placeholder="@channel_id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Industries */}
            <FormField
              control={form.control}
              name="industries"
              render={() => (
                <FormItem>
                  <FormLabel>Ngành hàng sở trường * (Chọn 1-3 ngành)</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industries.map((industry) => (
                      <FormField
                        key={industry}
                        control={form.control}
                        name="industries"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={industry}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(industry)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, industry])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== industry
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {industry}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sales_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình thức bán hàng *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Livestream">Livestream</SelectItem>
                        <SelectItem value="Cả hai">Cả hai</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="follower_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng follower *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expected_cast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức cast mong muốn (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gmv_30_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GMV 30 ngày gần nhất (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shipping_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ nhận hàng *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Vui lòng nhập chính xác địa chỉ để thuận tiện cho việc gửi sản phẩm mẫu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="job_completion_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tốc độ trả job (số ngày) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Sau bao nhiêu ngày kể từ khi nhận sản phẩm mẫu?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng KOC có thể tập hợp *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Nếu job ngon, bạn có thể tập hợp thêm bao nhiêu KOC?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="collaboration_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả thêm về mong muốn hợp tác</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Chia sẻ về nhu cầu, mong muốn hợp tác của bạn..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn về bản thân</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Giới thiệu ngắn gọn về bản thân và thế mạnh..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký làm KOC
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default KOCRegistrationForm;