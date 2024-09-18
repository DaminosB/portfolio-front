// No customStyle so it can be set directly in the parnet component

// Next components
import Link from "next/link";

const NavPages = ({ profile, pages, customStyle }) => {
  return (
    <nav>
      {/* The pages created by the user are displayed through a .map function */}
      {pages.map((page, index) => {
        return (
          <Link key={page.id} href={`/user-pages/${page.id}`}>
            {page.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavPages;
