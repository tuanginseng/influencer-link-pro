import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const industries = [
  'Thời trang', 'Làm đẹp', 'Điện tử', 'Gia dụng', 'Thực phẩm',
  'Du lịch', 'Giáo dục', 'Sức khỏe', 'Thể thao', 'Mẹ và bé',
  'Nội thất', 'Phụ kiện', 'Giải trí', 'Khác'
];

const brandSchema = z.object({
  brand_name: z.string().min(2, "Tên thương hiệu phải có ít nhất 2 ký tự"),
  contact_person: z.string().min(2, "Tên người liên hệ phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  industry: z.string().min(1, "Vui lòng chọn ngành hàng"),
  expected_budget: z.number().optional(),
  short_description: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

const BrandRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      industry: "Thời trang",
    },
  });

  const onSubmit = async (data: BrandFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('brands')
        .insert([data as any]);

      if (error) throw error;

      toast({
        title: "Đăng ký thành công!",
        description: "Thông tin Brand của bạn đã được ghi nhận. Admin sẽ liên hệ sớm.",
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
        <CardTitle>Thông tin đăng ký Brand</CardTitle>
        <CardDescription>
          Vui lòng điền đầy đủ thông tin để chúng tôi có thể kết nối bạn với các KOC phù hợp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="brand_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thương hiệu *</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Fashion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn B" {...field} />
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
                    <Input placeholder="contact@brand.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngành hàng *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ngành hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngân sách dự kiến (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10000000"
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
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn về thương hiệu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Giới thiệu về thương hiệu, sản phẩm và mục tiêu hợp tác..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký làm Brand
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BrandRegistrationForm;