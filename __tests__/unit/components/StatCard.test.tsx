import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/admin/StatCard";

describe("StatCard", () => {
  it("renders the title and value", () => {
    render(<StatCard title="Total Students" value={42} />);
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders a string value as-is", () => {
    render(<StatCard title="Occupancy" value="87%" />);
    expect(screen.getByText("87%")).toBeInTheDocument();
  });

  it("renders the optional sub text when provided", () => {
    render(<StatCard title="Revenue" value="$1,200" sub="vs last month" />);
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("does not render sub text when omitted", () => {
    render(<StatCard title="Revenue" value="$1,200" />);
    expect(screen.queryByText("vs last month")).not.toBeInTheDocument();
  });
});
