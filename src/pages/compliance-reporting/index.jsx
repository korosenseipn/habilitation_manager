import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ReportBuilder from './components/ReportBuilder';
import ComplianceMetrics from './components/ComplianceMetrics';
import ComplianceChart from './components/ComplianceChart';
import ComplianceTable from './components/ComplianceTable';
import ScheduledReports from './components/ScheduledReports';

const ComplianceReporting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleGenerateReport = async (reportParams) => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      console.log('Generating report with parameters:', reportParams);
      setIsGeneratingReport(false);
      
      // Simulate download
      const reportName = `compliance-report-${new Date().toISOString().split('T')[0]}.${reportParams.reportFormat}`;
      console.log(`Report generated: ${reportName}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Compliance Reporting</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and audit capabilities for habilitation compliance tracking
            </p>
          </div>

          {/* Compliance Metrics */}
          <section>
            <ComplianceMetrics />
          </section>

          {/* Report Builder */}
          <section>
            <ReportBuilder 
              onGenerateReport={handleGenerateReport}
              isGenerating={isGeneratingReport}
            />
          </section>

          {/* Compliance Analytics Chart */}
          <section>
            <ComplianceChart />
          </section>

          {/* Compliance Details Table */}
          <section>
            <ComplianceTable />
          </section>

          {/* Scheduled Reports */}
          <section>
            <ScheduledReports />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ComplianceReporting;