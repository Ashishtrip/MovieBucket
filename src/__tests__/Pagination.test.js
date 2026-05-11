/**
 * @file Pagination.test.js
 * Unit tests for the Pagination component.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/UI/Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page buttons', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current="page"', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );
    expect(
      screen.getByRole('button', { name: 'Page 3' })
    ).toHaveAttribute('aria-current', 'page');
  });

  it('disables the Previous button on page 1', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange with the correct page number', async () => {
    const mockChange = jest.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockChange} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(mockChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with currentPage - 1 when Previous is clicked', async () => {
    const mockChange = jest.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockChange} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(mockChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with currentPage + 1 when Next is clicked', async () => {
    const mockChange = jest.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockChange} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(mockChange).toHaveBeenCalledWith(4);
  });
});
