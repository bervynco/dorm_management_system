<?php
class compute_model extends CI_Model {
    function selectAllBilling($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('billing');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function getComputeData($branchId){
        $sql = "Select tenant.tenant_id, tenant.room_tenant_id, tenant.tenant_name, room.room_id, room.room_rate, 
        utility_tenant.status, tenant.status, utility.utility_name, utility.utility_amount from tenant 
        LEFT JOIN room_tenant ON room_tenant.room_tenant_id = tenant.room_tenant_id 
        JOIN room on room.room_id = room_tenant.room_id 
        LEFT JOIN utility_tenant on utility_tenant.tenant_id = tenant.tenant_id 
        LEFT JOIN utility on utility.utility_id = utility_tenant.utility_id 
        where tenant.status = 'active' and room.branch_id = ". $branchId;
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

