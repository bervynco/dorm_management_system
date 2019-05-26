<?php
class payment_model extends CI_Model {
    function selectPaymentTypes() {
        $query = $this->db->get('payment');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    
}

?>

