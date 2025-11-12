'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Modal,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui'

export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const selectOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">UI Components Demo</h1>

        {/* Buttons */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Different button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Input, Textarea, and Select components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Username"
              placeholder="Enter your username"
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              helperText="We'll never share your email"
            />
            <Input
              label="Password"
              type="password"
              error="Password must be at least 8 characters"
            />
            <Textarea
              label="Description"
              placeholder="Enter description"
              rows={3}
            />
            <Select
              label="Select Option"
              options={selectOptions}
              placeholder="Choose an option"
            />
          </CardContent>
        </Card>

        {/* Badges */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Data table component</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>Guru</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>bob@example.com</TableCell>
                  <TableCell>Guru</TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Modal</CardTitle>
            <CardDescription>Dialog and modal component</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          description="This is a modal dialog example"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is the modal content. You can put any content here including forms,
              text, images, or other components.
            </p>
            <Input label="Name" placeholder="Enter your name" />
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}
