import { Component, Prop } from '@stencil/core';
import '@stencil/router';
import 'bootstrap.native/dist/bootstrap-native-v4';

@Component({
    tag: 'stenciljs-jsonschema-forms',
})
export class StencilBsDemoPage {
    @Prop() root = '/';
    components = [
        {
            url: '/form',
            title: 'Form Component',
            componentName: 'form-page',
            isHiden: false
        }
    ]

    render() {
        return ([
            <cwc-styles/>,
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <h1>UI Library</h1>
                    </div>
                </div>
                <div class="row">
                    <nav class="col-2">
                        <ul class="nav flex-column">
                            {this.components.filter(cmp => !cmp.isHiden).map((cmp) =>
                                <li class="nav-item">
                                    <stencil-route-link
                                            url={cmp.url}
                                            activeClass="active"
                                            class="nav-link"
                                            >
                                            {cmp.title}
                                    </stencil-route-link>
                                </li>
                            )}
                        </ul>
                    </nav>
                    <main class="col-10">
                        <stencil-router root={this.root}>
                            {this.components.filter(cmp => !cmp.isHiden).map((cmp) =>
                                    <stencil-route
                                        url={cmp.url}
                                        component={cmp.componentName}
                                    />
                            )}
                        </stencil-router>
                    </main>
                </div>
            </div>
        ])
    }
}
