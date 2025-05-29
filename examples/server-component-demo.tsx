/**
 * Server Component Demo - No useState Required!
 *
 * This demonstrates how to create animated accordions, menubars, and other
 * interactive components in React Server Components without any client-side state.
 */

import {
  SelfContainedDetails,
  SelfContainedToggle,
} from "@abdullah-altun/react-animation-library";
// Import the CSS - this can be done in your layout or main CSS file
import "@abdullah-altun/react-animation-library/styles";

// 🎯 ACCORDION EXAMPLE - Perfect for FAQ sections
export function ServerAccordion() {
  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>

      {/* Each accordion item is completely self-contained */}
      <SelfContainedDetails
        trigger={
          <div className="accordion-header">
            <span>What is React Server Components?</span>
            <span className="accordion-icon">▼</span>
          </div>
        }
        animationType="slide-down"
        duration={300}
        className="faq-item"
      >
        <div className="accordion-content">
          <p>
            React Server Components allow you to render components on the
            server, reducing bundle size and improving performance.
          </p>
        </div>
      </SelfContainedDetails>

      <SelfContainedDetails
        trigger={
          <div className="accordion-header">
            <span>How does this animation work without JavaScript?</span>
            <span className="accordion-icon">▼</span>
          </div>
        }
        animationType="slide-down"
        duration={300}
        className="faq-item"
      >
        <div className="accordion-content">
          <p>
            It uses CSS animations combined with the native HTML details/summary
            elements for state management.
          </p>
        </div>
      </SelfContainedDetails>

      <SelfContainedDetails
        trigger={
          <div className="accordion-header">
            <span>Can I customize the animations?</span>
            <span className="accordion-icon">▼</span>
          </div>
        }
        animationType="fade"
        duration={400}
        className="faq-item"
        defaultOpen={true} // This one starts open
      >
        <div className="accordion-content">
          <p>
            Yes! You can customize duration, easing, animation type, and add
            your own CSS classes.
          </p>
        </div>
      </SelfContainedDetails>
    </div>
  );
}

// 🎯 NAVIGATION MENUBAR EXAMPLE - Perfect for dropdown menus
export function ServerNavigationMenu() {
  return (
    <nav className="main-navigation">
      <div className="nav-items">
        <a href="/" className="nav-link">
          Home
        </a>

        {/* Dropdown menu using SelfContainedToggle */}
        <SelfContainedToggle
          variant="checkbox"
          animationType="slide-down"
          duration={250}
          trigger={<label className="nav-dropdown-trigger">Products ▼</label>}
          className="nav-dropdown"
        >
          <div className="dropdown-menu">
            <a href="/products/web" className="dropdown-item">
              Web Development
            </a>
            <a href="/products/mobile" className="dropdown-item">
              Mobile Apps
            </a>
            <a href="/products/desktop" className="dropdown-item">
              Desktop Software
            </a>
            <a href="/products/consulting" className="dropdown-item">
              Consulting
            </a>
          </div>
        </SelfContainedToggle>

        {/* Another dropdown */}
        <SelfContainedToggle
          variant="checkbox"
          animationType="fade"
          duration={200}
          trigger={<label className="nav-dropdown-trigger">Resources ▼</label>}
          className="nav-dropdown"
        >
          <div className="dropdown-menu">
            <a href="/blog" className="dropdown-item">
              Blog
            </a>
            <a href="/docs" className="dropdown-item">
              Documentation
            </a>
            <a href="/tutorials" className="dropdown-item">
              Tutorials
            </a>
            <a href="/support" className="dropdown-item">
              Support
            </a>
          </div>
        </SelfContainedToggle>

        <a href="/contact" className="nav-link">
          Contact
        </a>
      </div>
    </nav>
  );
}

// 🎯 SIDEBAR MENU EXAMPLE - Perfect for mobile navigation
export function ServerSidebarMenu() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>

      <div className="sidebar-content">
        {/* Collapsible menu sections */}
        <SelfContainedDetails
          trigger={
            <div className="sidebar-section-header">
              <span>📊 Analytics</span>
              <span className="sidebar-icon">▼</span>
            </div>
          }
          animationType="slide-down"
          className="sidebar-section"
          defaultOpen={true}
        >
          <div className="sidebar-links">
            <a href="/analytics/overview" className="sidebar-link">
              Overview
            </a>
            <a href="/analytics/reports" className="sidebar-link">
              Reports
            </a>
            <a href="/analytics/insights" className="sidebar-link">
              Insights
            </a>
          </div>
        </SelfContainedDetails>

        <SelfContainedDetails
          trigger={
            <div className="sidebar-section-header">
              <span>👥 Users</span>
              <span className="sidebar-icon">▼</span>
            </div>
          }
          animationType="slide-down"
          className="sidebar-section"
        >
          <div className="sidebar-links">
            <a href="/users/list" className="sidebar-link">
              User List
            </a>
            <a href="/users/roles" className="sidebar-link">
              Roles & Permissions
            </a>
            <a href="/users/activity" className="sidebar-link">
              Activity Log
            </a>
          </div>
        </SelfContainedDetails>

        <SelfContainedDetails
          trigger={
            <div className="sidebar-section-header">
              <span>⚙️ Settings</span>
              <span className="sidebar-icon">▼</span>
            </div>
          }
          animationType="slide-down"
          className="sidebar-section"
        >
          <div className="sidebar-links">
            <a href="/settings/general" className="sidebar-link">
              General
            </a>
            <a href="/settings/security" className="sidebar-link">
              Security
            </a>
            <a href="/settings/integrations" className="sidebar-link">
              Integrations
            </a>
          </div>
        </SelfContainedDetails>
      </div>
    </aside>
  );
}

// 🎯 CARD GRID WITH EXPANDABLE DETAILS
export function ServerExpandableCards() {
  const products = [
    {
      id: 1,
      title: "Premium Plan",
      price: "$29/month",
      description: "Perfect for growing businesses",
      features: [
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
    },
    {
      id: 2,
      title: "Enterprise Plan",
      price: "$99/month",
      description: "For large organizations",
      features: [
        "Everything in Premium",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
    },
    {
      id: 3,
      title: "Starter Plan",
      price: "$9/month",
      description: "Great for individuals",
      features: [
        "5 projects",
        "Basic support",
        "Core features",
        "1 team member",
      ],
    },
  ];

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="card-header">
            <h3>{product.title}</h3>
            <div className="price">{product.price}</div>
            <p>{product.description}</p>
          </div>

          {/* Expandable features section */}
          <SelfContainedDetails
            trigger={
              <button className="expand-features-btn">View Features ▼</button>
            }
            animationType="scale"
            duration={300}
            className="features-section"
          >
            <div className="features-list">
              <h4>What's included:</h4>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button className="cta-button">Choose Plan</button>
            </div>
          </SelfContainedDetails>
        </div>
      ))}
    </div>
  );
}

// 🎯 MAIN SERVER COMPONENT DEMO PAGE
export default function ServerComponentDemo() {
  return (
    <div className="demo-page">
      <header className="demo-header">
        <h1>Server Component Animation Demo</h1>
        <p>All animations work without any client-side JavaScript state!</p>
      </header>

      <main className="demo-content">
        <section className="demo-section">
          <h2>📋 FAQ Accordion</h2>
          <ServerAccordion />
        </section>

        <section className="demo-section">
          <h2>🧭 Navigation Menu</h2>
          <ServerNavigationMenu />
        </section>

        <section className="demo-section">
          <h2>📱 Sidebar Menu</h2>
          <ServerSidebarMenu />
        </section>

        <section className="demo-section">
          <h2>💳 Expandable Cards</h2>
          <ServerExpandableCards />
        </section>
      </main>
    </div>
  );
}

/*
🔥 KEY BENEFITS:

1. ✅ NO useState - Everything is self-contained
2. ✅ NO useEffect - Pure CSS animations
3. ✅ NO client JavaScript - Works in Server Components
4. ✅ SEO Friendly - All content is server-rendered
5. ✅ Accessible - Uses semantic HTML elements
6. ✅ Performant - No JavaScript bundle overhead
7. ✅ Customizable - Easy to style and configure

🎨 HOW IT WORKS:

- SelfContainedDetails: Uses HTML <details>/<summary> for native state
- SelfContainedToggle: Uses HTML <input type="checkbox"> for native state  
- CSS animations handle the visual transitions
- No client-side JavaScript required!

🚀 USAGE IN YOUR PROJECT:

1. Import the components and CSS
2. Use them like any other React component
3. Customize with props and CSS classes
4. Deploy as Server Components - they just work!
*/
