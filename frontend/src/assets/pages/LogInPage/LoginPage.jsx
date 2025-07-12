import CheckboxGhinhomatkhau from "../../components/common/CheckboxGhinhomatkhau";

const [rememberMe, setRememberMe] = useState(false);

<CheckboxGhinhomatkhau
  checked={rememberMe}
  onClick={() => setRememberMe(!rememberMe)}
  className="!absolute !w-[21px] !h-[22px] !top-[293px] !left-[15px]"
/>
