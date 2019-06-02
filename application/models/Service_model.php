<?php
class Service_model extends CI_Model {

    function getAllServices($branchId) {
        $this->db->select(array('tenant.tenant_id', 'tenant.tenant_name', 'service.*'));
        $this->db->from('service');
        $this->db->join('tenant', 'service.tenant_id = tenant.tenant_id');
        $this->db->where('service.branch_id', $branchId);
        $this->db->where('service.status', "active");
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertNewService($service) {
        $query = $this->db->insert('service', $service);
        return $this->db->insert_id();
    }

    function updateService($serviceId, $status) {
        $query = $this->db->where('service_id', $serviceId)
                            ->update('service', 
                            array(
                                'status' => $status
                            )
        );
        return $this->db->affected_rows();
    }

    function deleteService($serviceID, $message){
        $query = $this->db->where('service_id', $serviceID)
                            ->update('service', 
                            array(
                                'status' => "inactive"
                            )
        );
        return $this->db->affected_rows();
    }

    function selectServicePerId($id){
        $this->db->select('service.*');
        $this->db->from('service');
        $this->db->where('service.service_id', $id);
        $this->db->where('service.status', "active");
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectServicePerTenant($branchId, $tenantId) {
        $this->db->select('service.*');
        $this->db->from('service');
        $this->db->where('service.tenant_id', $tenantId);
        $this->db->where('service.branch_id', $branchId);
        $this->db->where('service.status', "active");
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertServicePayment($payment){
        $query = $this->db->insert('service_payment', $payment);
        return $this->db->insert_id();
    }
}

?>