
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import FloatingElements from "@/components/FloatingElements";
import Footer from "@/components/Footer";
import SMEForm from "@/components/SMEForm";
import InvestorView from "@/components/InvestorView";

const Invoice = () => {
  const [activeTab, setActiveTab] = useState("sme");
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("user") !== null;

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    setTimeout(() => navigate("/login"), 0);
    return null;
  }

  return (
    <div className="min-h-screen bg-fundora-dark text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-orbitron text-gradient text-center mb-10">
            Choose Your Path
          </h1>

          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-5xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 glass-morphism mb-8">
              <TabsTrigger 
                value="sme"
                className="py-4 data-[state=active]:text-gradient data-[state=active]:font-semibold"
              >
                <FileUp className="mr-2" /> Use as SME (Mint Invoice)
              </TabsTrigger>
              <TabsTrigger 
                value="investor"
                className="py-4 data-[state=active]:text-gradient data-[state=active]:font-semibold"
              >
                <DollarSign className="mr-2" /> Use as Investor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sme" className="mt-0">
              <Card className="glass-morphism border border-fundora-blue/30">
                <CardContent className="pt-6">
                  <SMEForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investor" className="mt-0">
              <Card className="glass-morphism border border-fundora-blue/30">
                <CardContent className="pt-6">
                  <InvestorView />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Invoice;
