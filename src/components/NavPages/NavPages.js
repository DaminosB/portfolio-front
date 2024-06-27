// No customStyle so it can be set directly in the parnet component

// Next components
import Link from "next/link";
import ContactButton from "../ContactButton/ContactButton";

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

      {/* The Contact page is created by default */}
      <ContactButton profile={profile} customStyle={customStyle} />
    </nav>
  );
};

export default NavPages;
