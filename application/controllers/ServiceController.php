<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ServiceController extends CI_Controller {

	public function index()
	{
    
	}

    public function changeTimezone($dateTime) {
        $manilaTimezone = new DateTimeZone('Asia/Manila');
        $dateTime = new DateTime($dateTime, $manilaTimezone);
        $offset = $manilaTimezone->getOffset($dateTime);
        $interval=DateInterval::createFromDateString((string)$offset . 'seconds');
        $dateTime->add($interval);
        return $dateTime;
    }
    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function getAllServices(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrTenants = $this->service_model->getAllServices($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving services list", $arrTenants));
    }

    public function addService() {
        $errorFlag = false;
        $object = array();
        $postData = json_decode(file_get_contents('php://input'), true);

        if($postData['recurrence'] == 'One Time'){
            print_r($postData);
            $serviceId = $this->service_model->insertNewService($postData);

            if($serviceId != 0){
                echo json_encode($this->returnArray(200, "Successfully added new service"));
            }
            else {
                echo json_encode($this->returnArray(500, "Error inserting new service"));
            }
        }
        else{
            $postData['start_date'] = $this->changeTimezone($postData['start_date'])->format('Y-m-d H:i:s');
            $postData['end_date'] = $this->changeTimezone($postData['end_date'])->format('Y-m-d H:i:s');
            $startDate = new DateTime($postData['start_date']);
            $endDate = new DateTime($postData['end_date']);
            while($startDate <= $endDate){
                $postData['start_date'] = $startDate->format('Y-m-d H:i:s');
                if(($postData['recurrence'] == 'Weekly')){
                    $startDate = $startDate->add(new DateInterval('P7D'));
                }
                else {
                    $startDate = $startDate->add(new DateInterval('P1M'));
                }
                $cloneStartDate = $startDate;
                $postData['end_date'] = $startDate->format('Y-m-d H:i:s');
                
                $serviceId = $this->service_model->insertNewService($postData);
                if($serviceId == 0){
                    $errorFlag = true;
                    break;
                }
            }
            if($errorFlag == true){
                echo json_encode($this->returnArray(500, "Error inserting new service"));
            }
            else{
                echo json_encode($this->returnArray(200, "Successfully added new service"));
            }
        }
        
    }

    public function editService() {
        $postData = json_decode(file_get_contents('php://input'), true);

        $status = $this->service_model->deleteService($postData['service_id']);

        if($status > 0){
            unset($postData['service_id']);
            unset($postData['tenant_name']);
            $postData['start_date'] = $this->changeTimezone($postData['start_date'])->format('Y-m-d H:i:s');
            $postData['end_date'] = $this->changeTimezone($postData['end_date'])->format('Y-m-d H:i:s');
            $serviceId = $this->service_model->insertNewService($postData);

            if($serviceId != 0){
                echo json_encode($this->returnArray(200, "Successfully added new service"));
            }
            else {
                echo json_encode($this->returnArray(500, "Error inserting new service"));
            }
        }
        else {
            echo json_encode($this->returnArray(500, "Error editing service"));
        }
    }

    public function deleteService() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $status = $this->service_model->deleteService($postData['id']);
        if($status > 0){
            echo json_encode($this->returnArray(200, "Successfully updated"));
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating"));
        }
    }
    public function getServicePerTenant() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $services = $this->service_model->selectServicePerTenant($postData['branch_id'], $postData['tenant_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving services list", $services));
    }

    public function makeServicePayment() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $payment = $postData;
        $branchId = $payment['branch_id'];
        unset($payment['branch_id']);
        
        $payment['payment_date'] = $this->changeTimezone($payment['payment_date'])->format('Y-m-d H:i:s');
        $servicePaymentId = $this->service_model->insertServicePayment($payment);

        if($servicePaymentId != 0){
            echo json_encode($this->returnArray(200, "Successfully completed payment"));

            if($payment['status'] == 'encashed'){
                $status = $this->service_model->updateService($postData['service_id'], 'encashed');
                $status = $this->payment_model->deletePaymentItem($postData['tenant_cheque_id'], $branchId, 'encashed');
            }
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error in payment"));
        }

        
    }

}
