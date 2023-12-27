
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/greeter",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/GreeterPage.vue") }],
  },
  {
    path: "/todo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/TodoPage.vue") }],
  },
  {
    path: "/voting",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/VotingPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes
