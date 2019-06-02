<?php
class compute_model extends CI_Model {
    function selectAllBilling($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('billing');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function getComputeData($branchId){
         $sql = "SELECT tenant.tenant_id, tenant.tenant_name, tenant.status as 'Tenant Status', service.service_id as 'Service Id', service.service_name as 'Service Name', service.service_fee as 'Service Fee', room.room_id as 'Room Id', room.room_rate as 'Room Rent', 
        room.room_number as 'Room Number', inventory_transaction.rent_amount as 'Inventory Rent Amount' , inventory_transaction.inventory_id as 'Inventory ID' , inventory.item_code as 'Inventory Code',
        inventory.item_name as 'Inventory Name', utility.utility_id, utility.utility_name, utility_price.price, utility_reading.current_reading
        FROM tenant 
        LEFT JOIN service on tenant.tenant_id = service.tenant_id 
        AND month(service.start_date) = 5 AND service.status = 'active' AND service.branch_id =".$branchId." AND tenant.branch_id =".$branchId."
        lEFT JOIN room_tenant on room_tenant.tenant_id = tenant.tenant_id AND room_tenant.status='active' 
        LEFT JOIN room on room.room_id = room_tenant.room_id 
        LEFT JOIN inventory_transaction on inventory_transaction.tenant_id = tenant.tenant_id AND inventory_transaction.inventory_transaction_type='rent' AND inventory_transaction.start_date <= NOW() AND inventory_transaction.end_date >= NOW()
        LEFT JOIN inventory on inventory.inventory_id = inventory_transaction.inventory_id
        LEFT JOIN utility on utility.branch_id =".$branchId."
        LEFT JOIN utility_reading on utility.utility_id = utility_reading.utility_id and utility_reading.status='active'
        LEFT JOIN utility_price on utility.utility_id = utility_price.utility_id and utility_price.status='active'";

        $query = $this->db->query($sql);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function closeBilling($billingId){
        $query = $this->db->where('billing_id', $billingId)
                          ->update('billing', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }
    function insertBillingInformation($billing){
        $query = $this->db->insert('billing', $billing);
        return $this->db->insert_id();
    }
    function inserBillingDetails($billing){
        $query = $this->db->insert('billing_data', $billing);
        return $this->db->insert_id();
    }

    function insertBillingData($billing){
        $query = $this->db->insert('billing_data', $billing);
        return $this->db->insert_id();
    }

    // function computeBillingDetails(){
    //     $sql = "SELECT tenant.*, service.service_id as 'Service Id', service.service_name as 'Service Name', service.service_fee as 'Service Fee', room.room_id as 'Room Id', room.room_rate as 'Room Rent', 
    //     room.room_number as 'Room Number', inventory_transaction.rent_amount as 'Inventory Rent Amount' , inventory_transaction.inventory_id as 'Inventory ID' , inventory.item_code as 'Inventory Code',
    //     inventory.item_name as 'Inventory Name', utility.utility_id, utility.utility_name, utility_price.price, utility_reading.current_reading
    //     FROM tenant 
    //     LEFT JOIN service on tenant.tenant_id = service.tenant_id 
    //     AND month(service.start_date) = 5 AND service.status = 'active' AND service.branch_id =".$branchId." AND tenant.branch_id =".$branchId."
    //     lEFT JOIN room_tenant on room_tenant.tenant_id = tenant.tenant_id AND room_tenant.status='active' 
    //     LEFT JOIN room on room.room_id = room_tenant.room_id 
    //     LEFT JOIN inventory_transaction on inventory_transaction.tenant_id = tenant.tenant_id AND inventory_transaction.inventory_transaction_type='rent' AND inventory_transaction.start_date <= NOW() AND inventory_transaction.end_date >= NOW()
    //     LEFT JOIN inventory on inventory.inventory_id = inventory_transaction.inventory_id
    //     LEFT JOIN utility on utility.branch_id =".$branchId."
    //     LEFT JOIN utility_reading on utility.utility_id = utility_reading.utility_id and utility_reading.status='active'
    //     LEFT JOIN utility_price on utility.utility_id = utility_price.utility_id and utility_price.status='active'"
    // }
    function getBillingDetails($branchId){
        $query = $this->db->where('branch_id', $branchId)->where('status', 'active')->get("billing_data");
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function getBillingDetailsPerBillingSummary($billingId){
        $sql = "SELECT billing_id, status, count(status) as 'status_count' FROM billing_data where billing_id = ". $billingId." group by status";
        $query = $this->db->query($sql);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function getBillingPerDate($branchId, $month, $year) {
        $query = $this->db->where('branch_id', $branchId)->where('month', $month)->where('year', $year)->get("billing");
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function checkDuplicateBilling($month, $year, $branchId) {
        $this->db->select("billing.*");
        $this->db->from("billing");
        $this->db->where("billing.branch_id", $branchId);
        $this->db->where("billing.month", $month);
        $this->db->where("billing.year", $year);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    
}

?>