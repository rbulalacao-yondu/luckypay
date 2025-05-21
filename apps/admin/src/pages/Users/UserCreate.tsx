import { Form, Input, Button, Card, Select, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import type { CreateUserDto } from '../../services/userService';
import { UserRole, UserStatus } from '../../types/User';

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const createUser = useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      message.success('User created successfully');
      navigate('/users');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to create user');
    },
  });

  const handleSubmit = (values: CreateUserDto) => {
    createUser.mutate(values);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/users" className="mr-4">
          <Button icon={<ArrowLeftOutlined />}>Back</Button>
        </Link>
        <h1 className="text-2xl font-bold">Create User</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-2xl"
        >
          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[{ required: true, message: 'Please input mobile number' }]}
          >
            <Input placeholder="Mobile number" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input type="email" placeholder="Email address" />
          </Form.Item>

          <Form.Item label="First Name" name="firstName">
            <Input placeholder="First name" />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName">
            <Input placeholder="Last name" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              {Object.values(UserRole).map((role) => (
                <Select.Option key={role} value={role}>
                  {role.replace(/_/g, ' ').toLowerCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue={UserStatus.ACTIVE}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              {Object.values(UserStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status.replace(/_/g, ' ').toLowerCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={createUser.isPending}
              className="mr-4"
            >
              Create User
            </Button>
            <Link to="/users">
              <Button>Cancel</Button>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserCreate;
