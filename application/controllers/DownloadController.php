<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once "application/libraries/xlswriter.class.php";
class DownloadController extends CI_Controller {

	public function index()
	{
    
	}
    public function assignDataToArray($postData, $arrColumns){
        $insertArray = array();
        foreach($arrColumns as $col){
            $insertArray[$col] = (!empty($postData[$col])) ? $postData[$col] : null;
        }
        return $insertArray;
    }
    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }

    public function downloadPage() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $branchId = $postData['branch_id'];
        $page = $postData['page'];
        $reportData = null;
        switch($page){
            case 'user': $reportData = $this->user_model->selectAllUsers($branchId);
                break;
            case 'utility': $reportData = $this->utility_model->selectAllUtility($branchId);
                break;
            case 'room': $reportData = $this->room_model->selectCountTenantPerRoomPerBranch($branchId);
                break;
            case 'payable': $reportData = $this->payable_model->selectAllPayablePerBranch($branchId);
                break;
            case 'calendar': $reportData = $this->calendar_model->selectAllCalendar($branchId);
                break;
            case 'inventory': $reportData = $this->inventory_model->selectAllInventoryPerBranch($branchId);
                break;
            case 'tenant'; $reportData=$this->tenant_model->selectAllTenantsPerBranch($branchId);
                break;
        }
        $titles = array_keys($reportData[0]);
        $writer = new XLSXWriter();
        array_unshift($reportData, $titles);
        $writer->writeSheet($reportData);
        $now = strtotime("now");
        $fileLocation = "reports/".$page."_".$now.".xlsx";
        $writer->writeToFile($fileLocation);

        echo $fileLocation;
    }

}
