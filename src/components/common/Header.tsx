import React, {useEffect, useRef, useState} from 'react';
import '../../styles/css/Header.css'
import '../../styles/css/index.css'
import {Button, Input, Nav, Navbar} from 'reactstrap';
import {Image, NavDropdown} from "react-bootstrap";
import {BoxArrowRight, ChevronLeft, List} from "react-bootstrap-icons";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {getUserFromStorage, removeAuthCookies, removeUserFromStorage} from "../../utils/userUtils";
import {useDispatch, useSelector} from "react-redux";
import RootState from "../../redux/RootState";
import _ from "lodash";
import {
    addInputFilter,
    addTagFilter,
    clearFilters,
    removeInputFilter,
    removeTagFilters,
    setError
} from "../../redux/filterSlice";
import {Tag, User} from "../../utils/types";
import {setCurrentPage} from "../../redux/pageSlice";
import {getTagsByNamePart} from "../../utils/tagUtils";
import {isAxiosError} from "axios";
import {ADMIN, SORT, TAG_REGEX} from "../../utils/constants";

const Header = () => {
        const user: User | null = getUserFromStorage()
        const dispatch = useDispatch();
        const location = useLocation();
        const filterState = useSelector((state: RootState) => state.filter)
        const navigate = useNavigate()
        const isFiltered = filterState.input || filterState.tags.length
        const queryParams = new URLSearchParams(location.search);
        const sortParams = queryParams.getAll(SORT)
        const isAdmin = user && user.role === ADMIN;
        const [search, setSearch] = useState('')
        const inputRef = useRef<HTMLInputElement | null>(null);

        const handleLogout = () => {
            removeUserFromStorage()
            removeAuthCookies()
            navigate("/")
        };

        function handleClear() {
            if (inputRef.current) {
                inputRef.current.value = ""
            }
            dispatch(setCurrentPage(1))
            dispatch(clearFilters())
        }

        function handleClearSort() {
            const queryParameters = new URLSearchParams(window.location.search);
            queryParameters.delete('sort');
            navigate(`?${queryParameters.toString()}`, {replace: false});
        }

        function handleLogoClick() {
            if (location.pathname !== "/")
                navigate("/")
        }

        const getTag = async (part: string) => {
            try {
                const response = await getTagsByNamePart(part)
                return response.content[0] as Tag
            } catch (e) {
                if (isAxiosError(e) && e.response)
                    if (e.response.status === 404)
                        dispatch(setError("Change the criteria"))
                    else
                        dispatch(setError(e.response.data.detail))
            }
        }

        const handleAdminFilter = async () => {
            const parseTags = (text: string) => {
                const matches = text.match(TAG_REGEX);
                let updatedSearch = text;
                if (matches) {
                    const tagNames = matches.map((match) => {
                        const tagName = match.substring(2, match.length - 1);
                        updatedSearch = updatedSearch.replace(match, "");
                        return tagName;
                    });
                    updatedSearch = updatedSearch.replaceAll(" ", "")
                    return {tagNames, updatedSearch};
                }
                return {tagNames: [], updatedSearch};
            };
            const {tagNames, updatedSearch} = parseTags(search)
            if (tagNames.length) {
                const fetchedTags = await Promise.all(tagNames.map((name) => getTag(name)));
                dispatch(removeTagFilters())
                fetchedTags.map(tag => tag && dispatch(addTagFilter(tag.id)))
            }
            if (updatedSearch)
                dispatch(addInputFilter(updatedSearch))
            else
                dispatch(removeInputFilter())
        }

        const handleUserFilter = () => {
            dispatch(setCurrentPage(1))
            dispatch(addInputFilter(search))
        }

        const handleInputChange = _.debounce((e) => {
            setSearch(e.target.value)
        }, 500)

        useEffect(() => {
            !isAdmin && handleUserFilter()
        }, [search]);
        return (
            <header>
                <Navbar color="light"
                        className="d-flex justify-content-between border-bottom border-gray bg-white">
                    <div className="col-1 align-content-center">
                        <div className="image-container m-auto d-none d-lg-block" onClick={handleLogoClick}>
                            <Image src="/logo.png" className="scaled-image "/>
                        </div>
                        {location.pathname.includes("/certificate/") ?
                            <ChevronLeft className="d-lg-none" size={20} onClick={() => navigate(-1)}/> :
                            <NavDropdown title={<List size={24}/>} className="d-lg-none" id="basic-nav-dropdown">
                                <NavDropdown.Item href='/'>
                                    <span>Home</span>
                                </NavDropdown.Item>

                                {user ? (
                                    <NavDropdown.Item href='/' className="d-block d-md-none">
                                        <span>Logout</span>
                                    </NavDropdown.Item>
                                ) : (
                                    <NavDropdown.Item href='/register'>
                                        <span>Sign Up</span>
                                    </NavDropdown.Item>
                                )}
                            </NavDropdown>}
                    </div>
                    <div className={location.pathname === "/" ? "d-flex col-6" : "d-none"}>
                        <Input
                            type="search"
                            placeholder="Search"
                            className={"me-2"}
                            innerRef={inputRef}
                            aria-label="Search"
                            onChange={handleInputChange}
                        />
                        {isAdmin && <Button
                            className="btn btn-light border-1 border-secondary-subtle"
                            onClick={handleAdminFilter}>Search</Button>}
                        {isFiltered ? <Button
                                className={(filterState.tags.length || filterState.input) ? "btn btn-light border-1 border-secondary-subtle" : "d-none"}
                                onClick={handleClear}>Clear</Button> :
                            <Button
                                className={(sortParams.length > 0) ? "btn btn-light border-1 border-secondary-subtle col-2" : "d-none"}
                                onClick={handleClearSort}>Disable sort</Button>}
                    </div>
                    <div className="d-flex justify-content-around align-items-center col-2 col-md-4 ">
                        {isAdmin &&
                            <NavDropdown title="Add new" id="basic-nav-dropdown">
                                <div className="d-flex flex-column px-2">
                                    <Link to="/create-certificate"
                                          className="btn btn-light border-1 border-dark">Certificate</Link>
                                    <br/>
                                    <Link to="/create-tag" className="btn btn-light border-1 border-dark">Tag</Link>
                                </div>
                            </NavDropdown>
                        }
                        {user ?
                            (
                                <Nav className="align-items-center">
                                    <Link to="/profile" className="d-flex align-items-center justify-content-between">
                                        <div className="image-container mx-1">
                                            <Image src={user.imageURL}
                                                   className="rounded-circle scaled-image"/>
                                        </div>
                                        <span className="d-none d-lg-block">{user.name}</span>
                                    </Link>

                                    <BoxArrowRight className="d-none d-md-block pe-auto " to="/" onClick={handleLogout}
                                                   size={24}/>
                                </Nav>
                            ) : (
                                <div className="d-flex">
                                    <NavLink to="/login">
                                        <span>Login</span>
                                    </NavLink>
                                    <NavLink className="d-none d-md-block" to="/register">
                                        <span>Sign Up</span>
                                    </NavLink>
                                </div>
                            )
                        }
                    </div>
                </Navbar>
            </header>
        );
    }
;

export default Header;