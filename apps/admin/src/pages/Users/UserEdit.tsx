import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Card, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import type { User } from '../../types/User';
import { UserRole, UserStatus } from '../../types/User';

interface UpdateUserFormData {
  email?: string;
  mobileNumber: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
}

const UserEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        mobileNumber: user.mobileNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, form]);

  const updateUser = useMutation({
    mutationFn: (data: UpdateUserFormData) =>
      userService.updateUser({ id: Number(id), ...data }),
    onSuccess: () => {
      message.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
    onError: (error: Error) => {
      message.error('Failed to update user: ' + error.message);
    },
  });

  const handleSubmit = (values: UpdateUserFormData) => {
    updateUser.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/users')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold m-0">Edit User</h1>
        </Space>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-2xl"
          initialValues={{
            status: UserStatus.ACTIVE,
          }}
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

          <Form.Item className="mb-0">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateUser.isPending}
                className="bg-primary hover:bg-primary-dark"
              >
                Update User
              </Button>
              <Button onClick={() => navigate('/users')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserEdit;
