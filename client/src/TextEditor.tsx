import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import { TOOLBAR_OPTIONS } from "./constants/Toolbar";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

const TextEditor: React.FC = () => {
	const { id: documentId } = useParams();
	const [socket, setSocket] = useState<Socket>();
	const [quill, setQuill] = useState<Quill>();
	useEffect(() => {
		if (socket == null || quill == null) return;
		socket.once("load-document", (document) => {
			quill.setContents(document);
			quill.enable();
		});

		socket.emit("get-document", documentId);
	}, [socket, quill, documentId]);

	useEffect(() => {
		if (socket == null || quill == null) return;
		const interval = setInterval(() => {
			socket.emit("save-document", quill.getContents());
		}, 2000);
		return () => {
			clearInterval(interval);
		};
	});

	useEffect(() => {
		const s = io("http://localhost:4000");
		setSocket(s);

		return () => {
			s.disconnect();
		};
	}, []);

	useEffect(() => {
		if (socket == null || quill == null) return;
		const changeHandler = (delta: any, oldDelta: any, source: any) => {
			if (source !== "user") return;
			socket?.emit("send-changes", delta);
		};
		quill?.on("text-change", changeHandler);

		return () => {
			quill?.off("text-change", changeHandler);
		};
	}, [socket, quill]);

	useEffect(() => {
		if (socket == null || quill == null) return;
		const changeHandler = (delta: any) => {
			quill?.updateContents(delta);
		};
		socket?.on("receive-changes", changeHandler);

		return () => {
			socket?.off("receive-changes", changeHandler);
		};
	}, [socket, quill]);

	const wrapperRef = useCallback((wrapper) => {
		if (wrapper == null) return;
		wrapper.innerHTML = "";
		const editor = document.createElement("div");
		wrapper.append(editor);
		Quill.register("modules/cursors", QuillCursors);
		const q = new Quill(editor, {
			modules: {
				cursors: {
					hideDelayMs: 5000,
					hideSpeedMs: 2000,
					selectionChangeSource: null,
					transformOnTextChange: true,
				},
				toolbar: TOOLBAR_OPTIONS,
			},
			theme: "snow",
		});
		q.disable();
		q.setText("Loading...");
		setQuill(q);
	}, []);
	return <div ref={wrapperRef} className='container'></div>;
};

export default TextEditor;
