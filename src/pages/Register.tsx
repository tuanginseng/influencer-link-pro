import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KOCRegistrationForm from "@/components/forms/KOCRegistrationForm";
import BrandRegistrationForm from "@/components/forms/BrandRegistrationForm";

const Register = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("koc");

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "brand") {
      setActiveTab("brand");
    } else {
      setActiveTab("koc");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Đăng ký tham gia</h1>
          <p className="text-muted-foreground">
            Chọn loại tài khoản phù hợp để bắt đầu hành trình hợp tác
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="koc">Đăng ký làm KOC</TabsTrigger>
            <TabsTrigger value="brand">Đăng ký làm Brand</TabsTrigger>
          </TabsList>
          
          <TabsContent value="koc">
            <KOCRegistrationForm />
          </TabsContent>
          
          <TabsContent value="brand">
            <BrandRegistrationForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Register;