<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once "application/libraries/xlswriter.class.php";
class ReportController extends CI_Controller {

	public function index()
	{
    
	}

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function generateReport(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $month = $postData['selected_month'];
        $year = $postData['selected_year'];

        switch($postData['selected_report']){
            case "Inventory": $reportData = $this->report_model->getInventoryReport($postData['branch_id'], 'inventory', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "User": $reportData = $this->report_model->getUserReport($postData['branch_id'], 'user', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Logs": $reportData = $this->report_model->getLogReport($postData['branch_id'], 'log', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Utility": $reportData = $this->report_model->getUtilityReport($postData['branch_id'], 'utility', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Tenant": $reportData = $this->report_model->getTenantReport($postData['branch_id'], 'tenant', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Room": $reportData = $this->report_model->getRoomReport($postData['branch_id'], 'room', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Payables": $reportData = $this->report_model->getPayablesReport($postData['branch_id'], 'payables', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Calendar": $reportData = $this->report_model->getCalendarReport($postData['branch_id'], 'calendar', 
                                            $postData['selected_report_type'], null, null);
                            break;
            case "Branch": $reportData = $this->report_model->getBranchReport($postData['branch_id'], 'branch', 
                                            $postData['selected_report_type'], null, null);
                            break;
        }

        $writer = new XLSXWriter();
        array_unshift($reportData, $titles);
        $writer->writeSheet($reportData);
        $now = strtotime("now");
        $fileLocation = "reports/".$now.".xlsx";
        $writer->writeToFile($fileLocation);

        echo $fileLocation;
        
    }
}
