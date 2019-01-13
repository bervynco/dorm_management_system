<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserController extends CI_Controller {

	public function index()
	{
    
	}

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    public function getAllUsersPerBranch(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUsers = $this->user_model->selectAllUsers($postData['branch_id']);
        echo json_encode($arrUsers);
    }

    public function addNewUser(){
        // $arrColumns = array('name', 'username', 'role', 'password');
        $postData = json_decode(file_get_contents('php://input'), true);
        $password = $postData['password'];
        $passwordObject['password'] =  $password_hash = password_hash($postData['password'], PASSWORD_BCRYPT);

        unset($postData['password']);

        $existing = $this->user_model->checkExisting("add", $postData);
         if($existing == 0){
            
            $userId = $this->user_model->insertUser($postData);
            $passwordObject['user_id'] = $userId;
            $passwordId = $this->user_model->insertPassword($passwordObject);
            if($userId != 0 && $passwordId != 0){
                echo json_encode($this->returnArray(200, "Successfully added user", $postData));
            }
            else {
                echo json_encode($this->returnArray(500, "Error inserting new user"));
            }
            
        }
        else
            echo json_encode($this->returnArray(500, "Username already exists"));
    }

    public function editUser(){
        $arrColumns = array('id', 'name', 'username', 'role');
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);

        $existing = $this->user_model->checkExisting("update", $arrUserDetail);
        if($existing == 0){
            $user = $this->user_model->updateUser($arrUserDetail);
            echo "Successful";
        }
        else
            echo "Existing user with that username";
        
    }

    public function deleteUser(){
        $arrColumns = array('id', 'name', 'username', 'role');
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);
        $user = $this->user_model->deleteUser($arrUserDetail);

        echo "Successful";
    }

    public function changePassword(){
        $arrColumns = array('id', 'name', 'password', 'confirmPassword');
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);

        $password = $this->user_model->updatePassword($arrUserDetail);

        echo "Successful";

    }

    public function login(){
        $arrLogin = json_decode(file_get_contents('php://input'), true);
        $user = $this->user_model->checkUserName($arrLogin['username']);
        
        if(count($user) != 0){
            $arrUser = array();
            $branch = array();
            foreach($user as $index => $row){
                $object['branch_id'] = (int)$row['branch_id'];
                $object['user_branch_id'] = (int)$row['user_branch_id'];
                $object['branch_name'] = $row['branch_name'];
                $object['role'] = $row['role'];
                array_push($branch, $object);
            }

            array_push($arrUser, $user[0]);
            $arrUser[0]['branch'] = $branch;
            unset($arrUser[0]['role']);
            unset($arrUser[0]['branch_id']);
            unset($arrUser[0]['user_branch_id']);
            unset($arrUser[0]['branch_location']);
            unset($arrUser[0]['branch_name']);
            echo json_encode($this->returnArray(200, "Login Successful", $arrUser));
        }
        else {
            echo json_encode($this->returnArray(500, "Invalid Username / Password"));
        }
        
        // if (password_verify($password, $passwordObject['password'])) {
        //     echo 'Password is valid!';
        // } else {
        //     echo 'Invalid password.';
        // }
    }

}
