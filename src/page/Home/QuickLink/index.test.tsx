import { PlusOutlined } from "@ant-design/icons";
import { fireEvent, screen } from "@testing-library/react";
import QuickLink from ".";
import { renderWithRouter } from "../../../testUtils/customRender";

describe("Home/QuickLink", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should match snapshot", () => {
    const { container } = renderWithRouter(
      <QuickLink text="test" icon={<PlusOutlined />} />
    );
    expect(container).toMatchSnapshot();

    fireEvent.mouseEnter(
      document.getElementsByClassName("fixed-widgets-dashboard-namespace")[0]
    );

    expect(container).toMatchSnapshot();
  });

  test("should execute handleClick when clicking button", () => {
    const mockHandleClick = jest.fn();
    renderWithRouter(
      <QuickLink
        text="test"
        icon={<PlusOutlined />}
        handleClick={mockHandleClick}
      />
    );

    expect(mockHandleClick).toBeCalledTimes(0);

    fireEvent.click(
      document.getElementsByClassName("fixed-widgets-dashboard-namespace")[0]
    );
    expect(mockHandleClick).toBeCalledTimes(1);
  });

  test("should render the text when mouse enter to button", () => {
    renderWithRouter(<QuickLink text="test" icon={<PlusOutlined />} />);

    expect(screen.queryByText("test")).not.toBeInTheDocument();

    fireEvent.mouseEnter(
      document.getElementsByClassName("fixed-widgets-dashboard-namespace")[0]
    );

    expect(screen.queryByText("test")).toBeInTheDocument();

    fireEvent.mouseLeave(
      document.getElementsByClassName("fixed-widgets-dashboard-namespace")[0]
    );
    expect(screen.queryByText("test")).not.toBeInTheDocument();
  });
});
