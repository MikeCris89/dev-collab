import prisma from "../client.js";

type DemoNote = { title: string; body: string };
type DemoFolder = { title: string; notes: DemoNote[] };
type DemoProject = { title: string; folders: DemoFolder[] };

// Static demo content seeded for demo accounts only (see POST /auth/demo).
// Note bodies are hand-written HTML matching the Tiptap allowlist in
// lib/utils.ts so NotePreview renders them without any sanitization round-trip.
export const DEMO_PROJECTS: DemoProject[] = [
	{
		title: "DevCollab API",
		folders: [
			{
				title: "Database",
				notes: [
					{
						title: "Schema design",
						body: [
							"<h2>Schema design</h2>",
							"<p>Core hierarchy is <code>Team → Project → Folder → Note</code>. Keeping it shallow so the queries stay simple.</p>",
							"<ul>",
							"<li>All IDs are <strong>CUID2</strong></li>",
							"<li>Cascade deletes from Team all the way down to Note</li>",
							"<li>Notes keep a nullable <code>userId</code> so deleting a user doesn't nuke their notes</li>",
							"</ul>",
							"<blockquote>Decision: a join table for project membership instead of an array column — way easier to query.</blockquote>",
						].join(""),
					},
					{
						title: "Migration TODOs",
						body: [
							"<h3>Before the next deploy</h3>",
							'<ul data-type="taskList">',
							'<li data-type="taskItem" data-checked="true"><p>Add index on <code>notes.folder_id</code></p></li>',
							'<li data-type="taskItem" data-checked="true"><p>Backfill <code>created_at</code> defaults</p></li>',
							'<li data-type="taskItem" data-checked="false"><p>Unique constraint on usernames</p></li>',
							'<li data-type="taskItem" data-checked="false"><p>Write the rollback script</p></li>',
							"</ul>",
						].join(""),
					},
				],
			},
			{
				title: "Backend",
				notes: [
					{
						title: "Auth flow",
						body: [
							"<h2>Auth flow</h2>",
							"<p>JWT lives in an <strong>httpOnly</strong> cookie named <code>session</code>, 7 day expiry.</p>",
							"<ol>",
							"<li>User signs up <em>or</em> hits the demo button</li>",
							"<li>Server signs a token and sets the cookie</li>",
							"<li><code>requireAuth</code> verifies it on every request</li>",
							"</ol>",
							'<p>Passwords are hashed with bcrypt. More in the <a href="https://github.com" target="_blank">repo</a>.</p>',
						].join(""),
					},
					{
						title: "API endpoints",
						body: [
							"<h3>REST routes</h3>",
							"<pre><code>POST /api/auth/signup\nPOST /api/auth/login\nGET  /api/team\nPOST /api/projects\nPOST /api/notes/:folderId</code></pre>",
							"<p>Everything under <code>/api</code> (except auth) requires the session cookie.</p>",
						].join(""),
					},
				],
			},
			{
				title: "Frontend",
				notes: [
					{
						title: "Component breakdown",
						body: [
							"<h2>Component breakdown</h2>",
							"<p>The sidebar drives the URL: <code>/p/:projectId/f/:folderId/n/:noteId</code>.</p>",
							"<ul>",
							"<li><strong>Sidebar</strong> — the projects / folders / notes tree</li>",
							"<li><strong>NotePreview</strong> — read-only Tiptap render</li>",
							"<li><strong>TiptapEditor</strong> — the editable view</li>",
							"</ul>",
							"<p>Server state lives in <em>React Query</em>; selection state in context.</p>",
						].join(""),
					},
				],
			},
		],
	},
	{
		title: "Notes App v2",
		folders: [
			{
				title: "Model",
				notes: [
					{
						title: "Data models",
						body: [
							"<h2>Data models</h2>",
							"<p>Sketching the shapes before writing any Prisma.</p>",
							"<ul>",
							"<li><strong>Note</strong> — title, body (HTML), author, timestamps</li>",
							"<li><strong>Comment</strong> — body, author, belongs to a note</li>",
							"</ul>",
							"<blockquote>Keep <code>body</code> as sanitized HTML so the editor round-trips cleanly.</blockquote>",
						].join(""),
					},
				],
			},
			{
				title: "View",
				notes: [
					{
						title: "UI sketches",
						body: [
							"<h3>UI sketches</h3>",
							"<p>Three-column layout: tree, note list, editor.</p>",
							'<ul data-type="taskList">',
							'<li data-type="taskItem" data-checked="true"><p>Dark mode toggle</p></li>',
							'<li data-type="taskItem" data-checked="false"><p>Collapse the sidebar on mobile</p></li>',
							'<li data-type="taskItem" data-checked="false"><p>Keyboard shortcuts</p></li>',
							"</ul>",
						].join(""),
					},
				],
			},
			{
				title: "Controller",
				notes: [
					{
						title: "Route handlers",
						body: [
							"<h2>Route handlers</h2>",
							"<p>Thin controllers: validation in middleware, DB access in the <code>queries</code> layer.</p>",
							"<ol>",
							"<li>Validate &amp; sanitize the input</li>",
							"<li>Call the query module</li>",
							"<li>Return typed JSON from the shared contract</li>",
							"</ol>",
							"<p><em>Note to self:</em> never let raw HTML reach the DB.</p>",
						].join(""),
					},
				],
			},
		],
	},
];

// Creates the full project → folder → note tree for a freshly created demo
// user, linking them to each project via projectsUsers.
export const seedDemoData = async (userId: string, teamId: string) => {
	for (const project of DEMO_PROJECTS) {
		await prisma.project.create({
			data: {
				title: project.title,
				teamId,
				projectsUsers: { create: [{ userId }] },
				folders: {
					create: project.folders.map((folder) => ({
						title: folder.title,
						notes: {
							create: folder.notes.map((note) => ({
								title: note.title,
								body: note.body,
								userId,
							})),
						},
					})),
				},
			},
		});
	}
};
